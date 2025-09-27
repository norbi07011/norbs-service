import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { validationResult } from 'express-validator';

export class TaskController {
  static async getAll(req, res) {
    try {
      const { projectId } = req.query;
      
      let tasks;
      if (projectId) {
        // If user is client, ensure they can only access their projects' tasks
        if (req.user.role === 'client') {
          const project = await Project.findById(projectId);
          if (!project || project.client_id !== req.user.clientId) {
            return res.status(403).json({
              error: 'Access denied to this project\'s tasks'
            });
          }
        }
        tasks = await Task.getByProjectId(projectId);
      } else {
        tasks = await Task.getAll();
      }
      
      res.json({
        tasks,
        total: tasks.length
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({
        error: 'Failed to fetch tasks'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      
      if (!task) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      // If user is client, ensure they can only access their tasks
      if (req.user.role === 'client' && task.client_id !== req.user.clientId) {
        return res.status(403).json({
          error: 'Access denied to this task'
        });
      }

      res.json({ task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({
        error: 'Failed to fetch task'
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

      // Check if project exists and user has access
      const project = await Project.findById(req.body.projectId);
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      if (req.user.role === 'client' && project.client_id !== req.user.clientId) {
        return res.status(403).json({
          error: 'Access denied to this project'
        });
      }

      const task = await Task.create(req.body);
      
      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create task'
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
      const existingTask = await Task.findById(id);
      
      if (!existingTask) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      // If user is client, ensure they can only update their tasks
      if (req.user.role === 'client' && existingTask.client_id !== req.user.clientId) {
        return res.status(403).json({
          error: 'Access denied to this task'
        });
      }

      const task = await Task.update(id, req.body);
      
      res.json({
        message: 'Task updated successfully',
        task
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update task'
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      // If user is client, ensure they can only delete their tasks
      if (req.user.role === 'client' && task.client_id !== req.user.clientId) {
        return res.status(403).json({
          error: 'Access denied to this task'
        });
      }

      await Task.delete(id);
      
      res.json({
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({
        error: 'Failed to delete task'
      });
    }
  }

  static async getStats(req, res) {
    try {
      const { projectId } = req.query;
      
      // If user is client, ensure they can only access their project stats
      if (req.user.role === 'client' && projectId) {
        const project = await Project.findById(projectId);
        if (!project || project.client_id !== req.user.clientId) {
          return res.status(403).json({
            error: 'Access denied to this project\'s statistics'
          });
        }
      }

      const stats = await Task.getTaskStats(projectId);
      res.json({ stats });
    } catch (error) {
      console.error('Get task stats error:', error);
      res.status(500).json({
        error: 'Failed to fetch task statistics'
      });
    }
  }

  static async getOverdue(req, res) {
    try {
      const overdueTasks = await Task.getOverdueTasks();
      
      // Filter tasks for clients
      let filteredTasks = overdueTasks;
      if (req.user.role === 'client') {
        filteredTasks = overdueTasks.filter(task => task.client_id === req.user.clientId);
      }
      
      res.json({
        tasks: filteredTasks,
        total: filteredTasks.length
      });
    } catch (error) {
      console.error('Get overdue tasks error:', error);
      res.status(500).json({
        error: 'Failed to fetch overdue tasks'
      });
    }
  }
}