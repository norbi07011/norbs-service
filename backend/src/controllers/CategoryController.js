import { Category } from '../models/Category.js';
import { Activity } from '../models/Activity.js';
import { validationResult } from 'express-validator';

export class CategoryController {
  static async getAll(req, res) {
    try {
      const { type, includeInactive = false, hierarchy = false } = req.query;
      
      let categories;
      if (hierarchy === 'true') {
        categories = await Category.getHierarchy(type);
      } else {
        categories = await Category.getAll(type, includeInactive === 'true');
      }
      
      res.json({
        categories,
        total: categories.length,
        hierarchy: hierarchy === 'true'
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        error: 'Failed to fetch categories'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      
      if (!category) {
        return res.status(404).json({
          error: 'Category not found'
        });
      }

      res.json({ category });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({
        error: 'Failed to fetch category'
      });
    }
  }

  static async getByType(req, res) {
    try {
      const { type } = req.params;
      const categories = await Category.getByType(type);
      
      res.json({
        categories,
        total: categories.length,
        type
      });
    } catch (error) {
      console.error('Get categories by type error:', error);
      res.status(500).json({
        error: 'Failed to fetch categories by type'
      });
    }
  }

  static async getPopular(req, res) {
    try {
      const { limit = 10 } = req.query;
      const categories = await Category.getPopular(parseInt(limit));
      
      res.json({
        categories,
        total: categories.length
      });
    } catch (error) {
      console.error('Get popular categories error:', error);
      res.status(500).json({
        error: 'Failed to fetch popular categories'
      });
    }
  }

  static async search(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { q: searchTerm, type } = req.query;
      const categories = await Category.search(searchTerm, type);
      
      res.json({
        categories,
        total: categories.length,
        searchTerm
      });
    } catch (error) {
      console.error('Search categories error:', error);
      res.status(500).json({
        error: 'Failed to search categories'
      });
    }
  }

  static async create(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const category = await Category.create(req.body);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `created category "${category.name}"`, {
        category_id: category.id,
        category_name: category.name,
        category_type: category.type
      });

      res.status(201).json({
        message: 'Category created successfully',
        category
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create category'
      });
    }
  }

  static async update(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          error: 'Category not found'
        });
      }

      const updatedCategory = await Category.update(id, req.body);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `updated category "${category.name}"`, {
        category_id: category.id,
        category_name: category.name,
        changes: Object.keys(req.body)
      });

      res.json({
        message: 'Category updated successfully',
        category: updatedCategory
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update category'
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          error: 'Category not found'
        });
      }

      await Category.softDelete(id);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `deleted category "${category.name}"`, {
        category_id: category.id,
        category_name: category.name
      });

      res.json({
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(400).json({
        error: error.message || 'Failed to delete category'
      });
    }
  }

  static async reorder(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { categoryIds } = req.body;
      await Category.reorder(categoryIds);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, 'reordered categories', {
        category_count: categoryIds.length,
        category_ids: categoryIds
      });

      res.json({
        message: 'Categories reordered successfully'
      });
    } catch (error) {
      console.error('Reorder categories error:', error);
      res.status(500).json({
        error: 'Failed to reorder categories'
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await Category.getStats();
      
      res.json({
        stats
      });
    } catch (error) {
      console.error('Get category stats error:', error);
      res.status(500).json({
        error: 'Failed to fetch category statistics'
      });
    }
  }

  static async createDefaults(req, res) {
    try {
      const categories = await Category.createDefaultCategories();

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `created default categories`, {
        categories_count: categories.length,
        category_names: categories.map(c => c.name)
      });

      res.status(201).json({
        message: `${categories.length} default categories created successfully`,
        categories
      });
    } catch (error) {
      console.error('Create default categories error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create default categories'
      });
    }
  }
}