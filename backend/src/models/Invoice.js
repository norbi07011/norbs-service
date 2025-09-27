import pool from '../database/pool.js';

export class Invoice {
  static async create(invoiceData) {
    const {
      invoiceNumber,
      clientId,
      projectId = null,
      amount,
      currency = 'EUR',
      taxRate = 0.21,
      status = 'draft',
      dueDate,
      description,
      items = [],
      notes = null
    } = invoiceData;

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Calculate totals
      const subtotal = parseFloat(amount);
      const taxAmount = subtotal * parseFloat(taxRate);
      const total = subtotal + taxAmount;

      // Create invoice
      const invoiceQuery = `
        INSERT INTO invoices (
          invoice_number, client_id, project_id, amount, currency,
          tax_rate, tax_amount, total, status, due_date, description, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      const invoiceValues = [
        invoiceNumber, clientId, projectId, subtotal, currency,
        taxRate, taxAmount, total, status, dueDate, description, notes
      ];

      const invoiceResult = await client.query(invoiceQuery, invoiceValues);
      const invoice = invoiceResult.rows[0];

      // Create invoice items if provided
      if (items.length > 0) {
        const itemsQuery = `
          INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
          VALUES ($1, $2, $3, $4, $5)
        `;

        for (const item of items) {
          const itemAmount = parseFloat(item.quantity) * parseFloat(item.unit_price);
          await client.query(itemsQuery, [
            invoice.id,
            item.description,
            item.quantity,
            item.unit_price,
            itemAmount
          ]);
        }
      }

      await client.query('COMMIT');
      return invoice;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const query = `
      SELECT i.*, c.name as client_name, c.email as client_email, p.name as project_name
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.id = $1 AND i.deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getByInvoiceNumber(invoiceNumber) {
    const query = `
      SELECT i.*, c.name as client_name, c.email as client_email, p.name as project_name
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.invoice_number = $1 AND i.deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [invoiceNumber]);
    return result.rows[0];
  }

  static async getAll(limit = 50, offset = 0, status = null) {
    let query = `
      SELECT i.*, c.name as client_name, c.email as client_email, p.name as project_name
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.deleted_at IS NULL
    `;

    const values = [];
    let paramCount = 1;

    if (status) {
      query += ` AND i.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    query += ` ORDER BY i.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getByClient(clientId, limit = 50, offset = 0) {
    const query = `
      SELECT i.*, c.name as client_name, c.email as client_email, p.name as project_name
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.client_id = $1 AND i.deleted_at IS NULL
      ORDER BY i.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [clientId, limit, offset]);
    return result.rows;
  }

  static async getByProject(projectId, limit = 50, offset = 0) {
    const query = `
      SELECT i.*, c.name as client_name, c.email as client_email, p.name as project_name
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.project_id = $1 AND i.deleted_at IS NULL
      ORDER BY i.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [projectId, limit, offset]);
    return result.rows;
  }

  static async getItems(invoiceId) {
    const query = `
      SELECT * FROM invoice_items
      WHERE invoice_id = $1
      ORDER BY created_at ASC
    `;
    
    const result = await pool.query(query, [invoiceId]);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = [
      'amount', 'currency', 'tax_rate', 'status', 'due_date', 
      'description', 'notes', 'paid_at'
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

    // Recalculate totals if amount or tax_rate changed
    if (updates.amount || updates.tax_rate) {
      const currentInvoice = await this.findById(id);
      const amount = parseFloat(updates.amount || currentInvoice.amount);
      const taxRate = parseFloat(updates.tax_rate || currentInvoice.tax_rate);
      const taxAmount = amount * taxRate;
      const total = amount + taxAmount;

      fields.push(`tax_amount = $${paramCount}`, `total = $${paramCount + 1}`);
      values.push(taxAmount, total);
      paramCount += 2;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE invoices 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async markAsPaid(id, paymentDate = new Date()) {
    const query = `
      UPDATE invoices 
      SET status = 'paid', paid_at = $2, updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, [id, paymentDate]);
    return result.rows[0];
  }

  static async markAsOverdue(id) {
    const query = `
      UPDATE invoices 
      SET status = 'overdue', updated_at = NOW()
      WHERE id = $1 AND status = 'sent' AND due_date < NOW() AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async softDelete(id) {
    const query = `
      UPDATE invoices 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_invoices,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
        SUM(total) as total_amount,
        SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status = 'sent' OR status = 'overdue' THEN total ELSE 0 END) as pending_amount,
        AVG(total) as average_invoice_amount
      FROM invoices 
      WHERE deleted_at IS NULL
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  static async getMonthlyStats(year = new Date().getFullYear()) {
    const query = `
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as invoice_count,
        SUM(total) as total_amount,
        SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) as paid_amount
      FROM invoices 
      WHERE EXTRACT(YEAR FROM created_at) = $1 AND deleted_at IS NULL
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY month
    `;

    const result = await pool.query(query, [year]);
    return result.rows;
  }

  static async getOverdueInvoices() {
    const query = `
      SELECT i.*, c.name as client_name, c.email as client_email
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.status = 'sent' AND i.due_date < NOW() AND i.deleted_at IS NULL
      ORDER BY i.due_date ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async updateOverdueInvoices() {
    const query = `
      UPDATE invoices 
      SET status = 'overdue', updated_at = NOW()
      WHERE status = 'sent' AND due_date < NOW() AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const query = `
      SELECT COALESCE(MAX(
        CAST(SPLIT_PART(invoice_number, '-', 2) AS INTEGER)
      ), 0) as last_number
      FROM invoices 
      WHERE invoice_number LIKE $1 AND deleted_at IS NULL
    `;

    const result = await pool.query(query, [`${year}-%`]);
    const lastNumber = result.rows[0].last_number || 0;
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
    
    return `${year}-${nextNumber}`;
  }

  static async isClientAllowedToView(invoiceId, clientId) {
    const query = `
      SELECT client_id FROM invoices
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await pool.query(query, [invoiceId]);
    const invoice = result.rows[0];
    
    return invoice && invoice.client_id === clientId;
  }
}