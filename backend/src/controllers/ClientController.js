import { Client } from '../models/Client.js';
import { validationResult } from 'express-validator';

export class ClientController {
  static async getAll(req, res) {
    try {
      const clients = await Client.getWithProjectsCount();
      res.json({
        clients,
        total: clients.length
      });
    } catch (error) {
      console.error('Get clients error:', error);
      res.status(500).json({
        error: 'Failed to fetch clients'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findById(id);
      
      if (!client) {
        return res.status(404).json({
          error: 'Client not found'
        });
      }

      res.json({ client });
    } catch (error) {
      console.error('Get client error:', error);
      res.status(500).json({
        error: 'Failed to fetch client'
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

      const client = await Client.create(req.body);
      
      res.status(201).json({
        message: 'Client created successfully',
        client
      });
    } catch (error) {
      console.error('Create client error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create client'
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
      const client = await Client.update(id, req.body);
      
      if (!client) {
        return res.status(404).json({
          error: 'Client not found'
        });
      }

      res.json({
        message: 'Client updated successfully',
        client
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update client'
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Check if client exists
      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({
          error: 'Client not found'
        });
      }

      await Client.delete(id);
      
      res.json({
        message: 'Client deleted successfully'
      });
    } catch (error) {
      console.error('Delete client error:', error);
      res.status(500).json({
        error: 'Failed to delete client'
      });
    }
  }
}