import pool from '../database/pool.js';

export class Category {
  static async create(categoryData) {
    const {
      name,
      description = null,
      color = '#3B82F6',
      icon = 'folder',
      type = 'project', // project, file, service, product
      parentId = null,
      isActive = true,
      sortOrder = 0
    } = categoryData;

    const query = `
      INSERT INTO categories (
        name, description, color, icon, type, parent_id, is_active, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [name, description, color, icon, type, parentId, isActive, sortOrder];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT c.*, 
             parent.name as parent_name,
             COUNT(projects.id) as project_count,
             COUNT(files.id) as file_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      LEFT JOIN projects ON projects.category_id = c.id
      LEFT JOIN files ON files.category = c.name
      WHERE c.id = $1 AND c.deleted_at IS NULL
      GROUP BY c.id, parent.name
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(type = null, includeInactive = false) {
    let query = `
      SELECT c.*, 
             parent.name as parent_name,
             COUNT(DISTINCT projects.id) as project_count,
             COUNT(DISTINCT files.id) as file_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      LEFT JOIN projects ON projects.category_id = c.id
      LEFT JOIN files ON files.category = c.name
      WHERE c.deleted_at IS NULL
    `;

    const values = [];
    let paramCount = 1;

    if (type) {
      query += ` AND c.type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    if (!includeInactive) {
      query += ` AND c.is_active = true`;
    }

    query += ` GROUP BY c.id, parent.name ORDER BY c.sort_order ASC, c.name ASC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getHierarchy(type = null) {
    const categories = await this.getAll(type, false);
    
    // Build hierarchy tree
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories.forEach(category => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    return rootCategories;
  }

  static async getByType(type) {
    return this.getAll(type, false);
  }

  static async getPopular(limit = 10) {
    const query = `
      SELECT c.*, 
             COUNT(DISTINCT projects.id) + COUNT(DISTINCT files.id) as usage_count
      FROM categories c
      LEFT JOIN projects ON projects.category_id = c.id
      LEFT JOIN files ON files.category = c.name
      WHERE c.deleted_at IS NULL AND c.is_active = true
      GROUP BY c.id
      ORDER BY usage_count DESC, c.name ASC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async search(searchTerm, type = null) {
    let query = `
      SELECT c.*, 
             parent.name as parent_name,
             COUNT(DISTINCT projects.id) as project_count,
             COUNT(DISTINCT files.id) as file_count
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      LEFT JOIN projects ON projects.category_id = c.id
      LEFT JOIN files ON files.category = c.name
      WHERE c.deleted_at IS NULL AND c.is_active = true
        AND (c.name ILIKE $1 OR c.description ILIKE $1)
    `;

    const values = [`%${searchTerm}%`];
    let paramCount = 2;

    if (type) {
      query += ` AND c.type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    query += ` GROUP BY c.id, parent.name ORDER BY c.name ASC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = [
      'name', 'description', 'color', 'icon', 'type', 
      'parent_id', 'is_active', 'sort_order'
    ];
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE categories 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async softDelete(id) {
    // Check if category has children
    const childrenQuery = `
      SELECT COUNT(*) as child_count 
      FROM categories 
      WHERE parent_id = $1 AND deleted_at IS NULL
    `;
    
    const childrenResult = await pool.query(childrenQuery, [id]);
    
    if (parseInt(childrenResult.rows[0].child_count) > 0) {
      throw new Error('Cannot delete category with subcategories. Please delete or move subcategories first.');
    }

    const query = `
      UPDATE categories 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async reorder(categoryIds) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (let i = 0; i < categoryIds.length; i++) {
        await client.query(
          'UPDATE categories SET sort_order = $1, updated_at = NOW() WHERE id = $2',
          [i, categoryIds[i]]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_categories,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_categories,
        COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as root_categories,
        COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as subcategories,
        COUNT(DISTINCT type) as types_count
      FROM categories 
      WHERE deleted_at IS NULL
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  // Predefined categories for quick setup
  static async createDefaultCategories() {
    const defaultCategories = [
      // Project categories
      { name: 'Webdesign', description: 'Website design projects', color: '#3B82F6', icon: 'globe', type: 'project' },
      { name: 'Logo Design', description: 'Logo and branding projects', color: '#F59E0B', icon: 'star', type: 'project' },
      { name: 'Koszulki', description: 'T-shirt design projects', color: '#EF4444', icon: 'shirt', type: 'project' },
      { name: 'Marketing', description: 'Marketing campaigns', color: '#10B981', icon: 'megaphone', type: 'project' },
      { name: 'E-commerce', description: 'Online store development', color: '#8B5CF6', icon: 'shopping-cart', type: 'project' },
      
      // File categories
      { name: 'Design Files', description: 'Design assets and mockups', color: '#EC4899', icon: 'image', type: 'file' },
      { name: 'Documents', description: 'Text documents and PDFs', color: '#6B7280', icon: 'file-text', type: 'file' },
      { name: 'Media', description: 'Images, videos, audio', color: '#F97316', icon: 'film', type: 'file' },
      { name: 'Code', description: 'Source code files', color: '#059669', icon: 'code', type: 'file' },
      
      // Service categories
      { name: 'Consulting', description: 'Consultation services', color: '#0EA5E9', icon: 'user-check', type: 'service' },
      { name: 'Development', description: 'Software development', color: '#DC2626', icon: 'code', type: 'service' },
      { name: 'Design', description: 'Creative design services', color: '#7C3AED', icon: 'palette', type: 'service' }
    ];

    const results = [];
    for (const category of defaultCategories) {
      try {
        const result = await this.create(category);
        results.push(result);
      } catch (error) {
        console.error(`Failed to create category ${category.name}:`, error.message);
      }
    }

    return results;
  }
}