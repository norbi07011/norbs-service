import { API_CONFIG, createAuthHeaders, clearAuthData } from '../config/api.js';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: createAuthHeaders(),
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle authentication errors
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.code === 'INVALID_TOKEN' || errorData.code === 'TOKEN_EXPIRED') {
          // Clear invalid tokens and redirect to login
          clearAuthData();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status,
          errorData.code,
          errorData.details
        );
      }

      const data = await response.json();
      return data;

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }
      
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        'Network error. Please check your connection.',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // File upload method
  async uploadFile(endpoint, formData) {
    const token = createAuthHeaders().Authorization;
    
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: token })
        // Don't set Content-Type for FormData, let browser set it with boundary
      }
    });
  }

  // Invoice methods
  async getInvoices(params = {}) {
    return this.get('/api/invoices', params);
  }

  async getInvoice(id) {
    return this.get(`/api/invoices/${id}`);
  }

  async getInvoiceByNumber(invoiceNumber) {
    return this.get(`/api/invoices/number/${invoiceNumber}`);
  }

  async getClientInvoices(clientId, params = {}) {
    return this.get(`/api/invoices/client/${clientId}`, params);
  }

  async getProjectInvoices(projectId, params = {}) {
    return this.get(`/api/invoices/project/${projectId}`, params);
  }

  async createInvoice(data) {
    return this.post('/api/invoices', data);
  }

  async updateInvoice(id, data) {
    return this.put(`/api/invoices/${id}`, data);
  }

  async markInvoiceAsPaid(id, paymentDate = null) {
    return this.post(`/api/invoices/${id}/mark-paid`, { paymentDate });
  }

  async deleteInvoice(id) {
    return this.delete(`/api/invoices/${id}`);
  }

  async getInvoiceStats() {
    return this.get('/api/invoices/stats/summary');
  }

  async getOverdueInvoices() {
    return this.get('/api/invoices/overdue/list');
  }

  async updateOverdueInvoices() {
    return this.post('/api/invoices/overdue/update');
  }
}

// Custom Error Class
export class ApiError extends Error {
  constructor(message, status = 0, code = 'UNKNOWN', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  isNetworkError() {
    return this.status === 0;
  }

  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  isServerError() {
    return this.status >= 500;
  }

  toString() {
    return `${this.name}: ${this.message} (${this.status}${this.code ? ` - ${this.code}` : ''})`;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;