import { Project } from '../models/Project.js';
import { validationResult } from 'express-validator';

export class ProjectController {
  static async getAll(req, res) {
    try {
      const projects = await Project.getWithStats();
      res.json({
        projects,
        total: projects.length
      });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        error: 'Failed to fetch projects'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      res.json({ project });
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({
        error: 'Failed to fetch project'
      });
    }
  }

  static async getByClientId(req, res) {
    try {
      const { clientId } = req.params;
      
      // If user is client, ensure they can only access their own projects
      if (req.user.role === 'client' && req.user.clientId !== clientId) {
        return res.status(403).json({
          error: 'Access denied to this client\'s projects'
        });
      }

      const projects = await Project.getByClientId(clientId);
      res.json({
        projects,
        total: projects.length
      });
    } catch (error) {
      console.error('Get client projects error:', error);
      res.status(500).json({
        error: 'Failed to fetch client projects'
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

      const project = await Project.create(req.body);
      
      res.status(201).json({
        message: 'Project created successfully',
        project
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create project'
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
      const project = await Project.update(id, req.body);
      
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      res.json({
        message: 'Project updated successfully',
        project
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update project'
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Check if project exists
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      await Project.delete(id);
      
      res.json({
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        error: 'Failed to delete project'
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await Project.getProjectStats();
      res.json({ stats });
    } catch (error) {
      console.error('Get project stats error:', error);
      res.status(500).json({
        error: 'Failed to fetch project statistics'
      });
    }
  }
}