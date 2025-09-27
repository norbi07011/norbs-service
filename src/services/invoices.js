import apiClient, { ApiError } from './apiClient.js';
import { MOCK_INVOICES } from '../../data/mockData.js';

export class InvoicesService {
  // Check if we should use real API
  static get useRealAPI() {
    return import.meta.env.VITE_USE_REAL_API === 'true';
  }

  static async getInvoices(params = {}) {
    if (!this.useRealAPI) {
      // Return mock invoices data
      return {
        invoices: MOCK_INVOICES || [],
        total: MOCK_INVOICES?.length || 0,
        limit: parseInt(params.limit) || 50,
        offset: parseInt(params.offset) || 0
      };
    }

    try {
      return await apiClient.getInvoices(params);
    } catch (error) {
      console.error('Get invoices error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to fetch invoices. Please try again.');
    }
  }

  static async getInvoice(id) {
    if (!this.useRealAPI) {
      const invoice = MOCK_INVOICES?.find(inv => inv.id === id || inv.id === parseInt(id));
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      return { invoice };
    }

    try {
      return await apiClient.getInvoice(id);
    } catch (error) {
      console.error('Get invoice error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to fetch invoice. Please try again.');
    }
  }

  static async getInvoiceByNumber(invoiceNumber) {
    if (!this.useRealAPI) {
      const invoice = MOCK_INVOICES?.find(inv => inv.invoiceNumber === invoiceNumber);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      return { invoice };
    }

    try {
      return await apiClient.getInvoiceByNumber(invoiceNumber);
    } catch (error) {
      console.error('Get invoice by number error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to fetch invoice. Please try again.');
    }
  }

  static async getClientInvoices(clientId, params = {}) {
    if (!this.useRealAPI) {
      const clientInvoices = MOCK_INVOICES?.filter(inv => inv.clientId === clientId || inv.clientId === parseInt(clientId)) || [];
      return {
        invoices: clientInvoices,
        total: clientInvoices.length,
        limit: parseInt(params.limit) || 50,
        offset: parseInt(params.offset) || 0
      };
    }

    try {
      return await apiClient.getClientInvoices(clientId, params);
    } catch (error) {
      console.error('Get client invoices error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to fetch client invoices. Please try again.');
    }
  }

  static async getProjectInvoices(projectId, params = {}) {
    if (!this.useRealAPI) {
      const projectInvoices = MOCK_INVOICES?.filter(inv => inv.projectId === projectId || inv.projectId === parseInt(projectId)) || [];
      return {
        invoices: projectInvoices,
        total: projectInvoices.length,
        limit: parseInt(params.limit) || 50,
        offset: parseInt(params.offset) || 0
      };
    }

    try {
      return await apiClient.getProjectInvoices(projectId, params);
    } catch (error) {
      console.error('Get project invoices error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to fetch project invoices. Please try again.');
    }
  }

  static async createInvoice(invoiceData) {
    if (!this.useRealAPI) {
      // For mock mode, simulate creating an invoice
      const newInvoice = {
        id: Date.now(),
        invoice_number: `INV-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...invoiceData
      };
      
      return {
        message: 'Invoice created successfully',
        invoice: newInvoice
      };
    }

    try {
      return await apiClient.createInvoice(invoiceData);
    } catch (error) {
      console.error('Create invoice error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to create invoice. Please try again.');
    }
  }

  static async updateInvoice(id, updates) {
    if (!this.useRealAPI) {
      // For mock mode, simulate updating an invoice
      return {
        message: 'Invoice updated successfully',
        invoice: { id, ...updates, updated_at: new Date().toISOString() }
      };
    }

    try {
      return await apiClient.updateInvoice(id, updates);
    } catch (error) {
      console.error('Update invoice error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to update invoice. Please try again.');
    }
  }

  static async markInvoiceAsPaid(id, paymentDate = null) {
    if (!this.useRealAPI) {
      // For mock mode, simulate marking as paid
      return {
        message: 'Invoice marked as paid successfully',
        invoice: { 
          id, 
          status: 'paid', 
          paid_at: paymentDate || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }

    try {
      return await apiClient.markInvoiceAsPaid(id, paymentDate);
    } catch (error) {
      console.error('Mark invoice as paid error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to mark invoice as paid. Please try again.');
    }
  }

  static async deleteInvoice(id) {
    if (!this.useRealAPI) {
      // For mock mode, simulate deleting invoice
      return {
        message: 'Invoice deleted successfully'
      };
    }

    try {
      return await apiClient.deleteInvoice(id);
    } catch (error) {
      console.error('Delete invoice error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to delete invoice. Please try again.');
    }
  }

  static async getInvoiceStats() {
    if (!this.useRealAPI) {
      // Return mock statistics
      const invoices = MOCK_INVOICES || [];
      const stats = {
        total_invoices: invoices.length,
        draft_count: invoices.filter(inv => inv.status === 'draft').length,
        sent_count: invoices.filter(inv => inv.status === 'sent').length,
        paid_count: invoices.filter(inv => inv.status === 'paid').length,
        overdue_count: invoices.filter(inv => inv.status === 'overdue').length,
        total_amount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        paid_amount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0),
        pending_amount: invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || 0), 0)
      };
      
      return { stats, monthlyStats: [] };
    }

    try {
      return await apiClient.getInvoiceStats();
    } catch (error) {
      console.error('Get invoice stats error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to fetch invoice statistics. Please try again.');
    }
  }

  static async getOverdueInvoices() {
    if (!this.useRealAPI) {
      const overdueInvoices = MOCK_INVOICES?.filter(inv => inv.status === 'overdue') || [];
      return {
        invoices: overdueInvoices,
        total: overdueInvoices.length
      };
    }

    try {
      return await apiClient.getOverdueInvoices();
    } catch (error) {
      console.error('Get overdue invoices error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to fetch overdue invoices. Please try again.');
    }
  }

  static async updateOverdueInvoices() {
    if (!this.useRealAPI) {
      // For mock mode, simulate updating overdue invoices
      return {
        message: '0 invoices marked as overdue',
        invoices: []
      };
    }

    try {
      return await apiClient.updateOverdueInvoices();
    } catch (error) {
      console.error('Update overdue invoices error:', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to update overdue invoices. Please try again.');
    }
  }
}

export default InvoicesService;