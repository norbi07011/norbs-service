import { Invoice } from '../models/Invoice.js';
import { Activity } from '../models/Activity.js';
import { validationResult } from 'express-validator';

export class InvoiceController {
  static async getAll(req, res) {
    try {
      const { limit = 50, offset = 0, status } = req.query;
      const invoices = await Invoice.getAll(parseInt(limit), parseInt(offset), status);
      
      res.json({
        invoices,
        total: invoices.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        status: status || 'all'
      });
    } catch (error) {
      console.error('Get invoices error:', error);
      res.status(500).json({
        error: 'Failed to fetch invoices'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id);
      
      if (!invoice) {
        return res.status(404).json({
          error: 'Invoice not found'
        });
      }

      // Check access permissions for clients
      if (req.user.role === 'client' && !await Invoice.isClientAllowedToView(id, req.user.id)) {
        return res.status(403).json({
          error: 'Access denied to this invoice'
        });
      }

      // Get invoice items
      const items = await Invoice.getItems(id);

      res.json({ 
        invoice: {
          ...invoice,
          items
        }
      });
    } catch (error) {
      console.error('Get invoice error:', error);
      res.status(500).json({
        error: 'Failed to fetch invoice'
      });
    }
  }

  static async getByInvoiceNumber(req, res) {
    try {
      const { invoiceNumber } = req.params;
      const invoice = await Invoice.getByInvoiceNumber(invoiceNumber);
      
      if (!invoice) {
        return res.status(404).json({
          error: 'Invoice not found'
        });
      }

      // Check access permissions for clients
      if (req.user.role === 'client' && !await Invoice.isClientAllowedToView(invoice.id, req.user.id)) {
        return res.status(403).json({
          error: 'Access denied to this invoice'
        });
      }

      // Get invoice items
      const items = await Invoice.getItems(invoice.id);

      res.json({ 
        invoice: {
          ...invoice,
          items
        }
      });
    } catch (error) {
      console.error('Get invoice by number error:', error);
      res.status(500).json({
        error: 'Failed to fetch invoice'
      });
    }
  }

  static async getByClient(req, res) {
    try {
      const { clientId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      // Clients can only access their own invoices
      if (req.user.role === 'client' && req.user.id !== clientId) {
        return res.status(403).json({
          error: 'Access denied to client invoices'
        });
      }

      const invoices = await Invoice.getByClient(clientId, parseInt(limit), parseInt(offset));

      res.json({
        invoices,
        total: invoices.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get client invoices error:', error);
      res.status(500).json({
        error: 'Failed to fetch client invoices'
      });
    }
  }

  static async getByProject(req, res) {
    try {
      const { projectId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const invoices = await Invoice.getByProject(projectId, parseInt(limit), parseInt(offset));

      res.json({
        invoices,
        total: invoices.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get project invoices error:', error);
      res.status(500).json({
        error: 'Failed to fetch project invoices'
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

      // Generate invoice number if not provided
      if (!req.body.invoiceNumber) {
        req.body.invoiceNumber = await Invoice.generateInvoiceNumber();
      }

      const invoice = await Invoice.create(req.body);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `created invoice ${invoice.invoice_number}`, {
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        client_id: invoice.client_id,
        amount: invoice.total
      });

      res.status(201).json({
        message: 'Invoice created successfully',
        invoice
      });
    } catch (error) {
      console.error('Create invoice error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create invoice'
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
      const invoice = await Invoice.findById(id);

      if (!invoice) {
        return res.status(404).json({
          error: 'Invoice not found'
        });
      }

      const updatedInvoice = await Invoice.update(id, req.body);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `updated invoice ${invoice.invoice_number}`, {
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        changes: Object.keys(req.body)
      });

      res.json({
        message: 'Invoice updated successfully',
        invoice: updatedInvoice
      });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update invoice'
      });
    }
  }

  static async markAsPaid(req, res) {
    try {
      const { id } = req.params;
      const { paymentDate } = req.body;

      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res.status(404).json({
          error: 'Invoice not found'
        });
      }

      const updatedInvoice = await Invoice.markAsPaid(id, paymentDate);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `marked invoice ${invoice.invoice_number} as paid`, {
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        payment_date: paymentDate || new Date()
      });

      res.json({
        message: 'Invoice marked as paid successfully',
        invoice: updatedInvoice
      });
    } catch (error) {
      console.error('Mark invoice as paid error:', error);
      res.status(500).json({
        error: 'Failed to mark invoice as paid'
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id);

      if (!invoice) {
        return res.status(404).json({
          error: 'Invoice not found'
        });
      }

      await Invoice.softDelete(id);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `deleted invoice ${invoice.invoice_number}`, {
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number
      });

      res.json({
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Delete invoice error:', error);
      res.status(500).json({
        error: 'Failed to delete invoice'
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await Invoice.getStats();
      const monthlyStats = await Invoice.getMonthlyStats();
      
      res.json({
        stats,
        monthlyStats
      });
    } catch (error) {
      console.error('Get invoice stats error:', error);
      res.status(500).json({
        error: 'Failed to fetch invoice statistics'
      });
    }
  }

  static async getOverdue(req, res) {
    try {
      const overdueInvoices = await Invoice.getOverdueInvoices();
      
      res.json({
        invoices: overdueInvoices,
        total: overdueInvoices.length
      });
    } catch (error) {
      console.error('Get overdue invoices error:', error);
      res.status(500).json({
        error: 'Failed to fetch overdue invoices'
      });
    }
  }

  static async updateOverdue(req, res) {
    try {
      const updatedInvoices = await Invoice.updateOverdueInvoices();
      
      // Log activity for each updated invoice
      for (const invoice of updatedInvoices) {
        await Activity.logActivity(req.user.id, req.user.name, `marked invoice ${invoice.invoice_number} as overdue`, {
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          due_date: invoice.due_date
        });
      }

      res.json({
        message: `${updatedInvoices.length} invoices marked as overdue`,
        invoices: updatedInvoices
      });
    } catch (error) {
      console.error('Update overdue invoices error:', error);
      res.status(500).json({
        error: 'Failed to update overdue invoices'
      });
    }
  }
}