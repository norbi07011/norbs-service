import { Activity } from '../models/Activity.js';
import { validationResult } from 'express-validator';

export class ActivityController {
  static async getAll(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const activities = await Activity.getAll(parseInt(limit), parseInt(offset));
      
      res.json({
        activities,
        total: activities.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({
        error: 'Failed to fetch activities'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const activity = await Activity.findById(id);
      
      if (!activity) {
        return res.status(404).json({
          error: 'Activity not found'
        });
      }

      res.json({ activity });
    } catch (error) {
      console.error('Get activity error:', error);
      res.status(500).json({
        error: 'Failed to fetch activity'
      });
    }
  }

  static async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      // Users can only access their own activities unless they are owner
      if (req.user.role !== 'owner' && req.user.id !== userId) {
        return res.status(403).json({
          error: 'Access denied to user activities'
        });
      }

      const activities = await Activity.getByUser(userId, parseInt(limit), parseInt(offset));
      
      res.json({
        activities,
        total: activities.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get user activities error:', error);
      res.status(500).json({
        error: 'Failed to fetch user activities'
      });
    }
  }

  static async getByDateRange(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { startDate, endDate, limit = 100, offset = 0 } = req.query;
      const activities = await Activity.getByDateRange(
        startDate, 
        endDate, 
        parseInt(limit), 
        parseInt(offset)
      );
      
      res.json({
        activities,
        total: activities.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        dateRange: { startDate, endDate }
      });
    } catch (error) {
      console.error('Get activities by date range error:', error);
      res.status(500).json({
        error: 'Failed to fetch activities by date range'
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await Activity.getStats();
      res.json({ stats });
    } catch (error) {
      console.error('Get activity stats error:', error);
      res.status(500).json({
        error: 'Failed to fetch activity statistics'
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

      // Use authenticated user info
      const activityData = {
        ...req.body,
        userId: req.user.id,
        userName: req.user.name
      };

      const activity = await Activity.create(activityData);
      
      res.status(201).json({
        message: 'Activity logged successfully',
        activity
      });
    } catch (error) {
      console.error('Create activity error:', error);
      res.status(400).json({
        error: error.message || 'Failed to log activity'
      });
    }
  }
}