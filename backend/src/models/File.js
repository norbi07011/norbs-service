import pool from '../database/pool.js';

export class File {
  static async create(fileData) {
    const {
      originalName,
      fileName,
      filePath,
      mimeType,
      size,
      projectId,
      uploadedBy,
      description = null,
      category = 'general',
      isPublic = false
    } = fileData;

    const query = `
      INSERT INTO files (
        original_name, file_name, file_path, mime_type, size,
        project_id, uploaded_by, description, category, is_public
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      originalName, fileName, filePath, mimeType, size,
      projectId, uploadedBy, description, category, isPublic
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT f.*, u.name as uploader_name
      FROM files f
      JOIN users u ON f.uploaded_by = u.id
      WHERE f.id = $1 AND f.deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getByProject(projectId, limit = 50, offset = 0) {
    const query = `
      SELECT f.*, u.name as uploader_name
      FROM files f
      JOIN users u ON f.uploaded_by = u.id
      WHERE f.project_id = $1 AND f.deleted_at IS NULL
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [projectId, limit, offset]);
    return result.rows;
  }

  static async getByUser(userId, limit = 50, offset = 0) {
    const query = `
      SELECT f.*, u.name as uploader_name, p.name as project_name
      FROM files f
      JOIN users u ON f.uploaded_by = u.id
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.uploaded_by = $1 AND f.deleted_at IS NULL
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async getPublicFiles(limit = 50, offset = 0) {
    const query = `
      SELECT f.*, u.name as uploader_name, p.name as project_name
      FROM files f
      JOIN users u ON f.uploaded_by = u.id
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.is_public = true AND f.deleted_at IS NULL
      ORDER BY f.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = ['description', 'category', 'is_public'];
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
      UPDATE files 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async softDelete(id) {
    const query = `
      UPDATE files 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getStorageStats() {
    const query = `
      SELECT 
        COUNT(*) as total_files,
        SUM(size) as total_size,
        AVG(size) as avg_file_size,
        COUNT(DISTINCT project_id) as projects_with_files,
        COUNT(DISTINCT uploaded_by) as users_uploaded
      FROM files 
      WHERE deleted_at IS NULL
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  static async getFilesByType() {
    const query = `
      SELECT 
        CASE 
          WHEN mime_type LIKE 'image/%' THEN 'image'
          WHEN mime_type LIKE 'application/pdf' THEN 'pdf'
          WHEN mime_type LIKE 'application/msword' OR mime_type LIKE 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' THEN 'document'
          WHEN mime_type LIKE 'application/vnd.ms-excel' OR mime_type LIKE 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' THEN 'spreadsheet'
          WHEN mime_type LIKE 'video/%' THEN 'video'
          WHEN mime_type LIKE 'audio/%' THEN 'audio'
          ELSE 'other'
        END as file_type,
        COUNT(*) as count,
        SUM(size) as total_size
      FROM files 
      WHERE deleted_at IS NULL
      GROUP BY file_type
      ORDER BY count DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async searchFiles(searchTerm, projectId = null, category = null, limit = 50, offset = 0) {
    let query = `
      SELECT f.*, u.name as uploader_name, p.name as project_name
      FROM files f
      JOIN users u ON f.uploaded_by = u.id
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.deleted_at IS NULL
        AND (f.original_name ILIKE $1 OR f.description ILIKE $1)
    `;

    const values = [`%${searchTerm}%`];
    let paramCount = 2;

    if (projectId) {
      query += ` AND f.project_id = $${paramCount}`;
      values.push(projectId);
      paramCount++;
    }

    if (category && category !== 'all') {
      query += ` AND f.category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    query += ` ORDER BY f.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async isFileAccessible(fileId, userId, userRole) {
    const query = `
      SELECT f.*, p.client_id
      FROM files f
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.id = $1 AND f.deleted_at IS NULL
    `;

    const result = await pool.query(query, [fileId]);
    const file = result.rows[0];

    if (!file) return false;

    // Owner can access all files
    if (userRole === 'owner') return true;

    // Public files can be accessed by anyone
    if (file.is_public) return true;

    // File uploader can access their own files
    if (file.uploaded_by === userId) return true;

    // Client can access files from their projects
    if (userRole === 'client' && file.client_id === userId) return true;

    return false;
  }
}