import pool from '../config/database.js';

export class Project {
  static async findById(id) {
    const result = await pool.query(
      `SELECT p.*, c.name as client_name, c.email as client_email
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(projectData) {
    const {
      title, description, status, priority, budgetType,
      budgetAmount, clientId, startDate, endDate
    } = projectData;

    const result = await pool.query(
      `INSERT INTO projects (title, description, status, priority, budget_type, budget_amount, client_id, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, status, priority, budgetType, budgetAmount, clientId, startDate, endDate]
    );
    return result.rows[0];
  }

  static async update(id, projectData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Map camelCase to snake_case for database fields
    const fieldMap = {
      budgetType: 'budget_type',
      budgetAmount: 'budget_amount',
      clientId: 'client_id',
      startDate: 'start_date',
      endDate: 'end_date'
    };

    Object.entries(projectData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = fieldMap[key] || key;
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE projects SET ${fields.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT p.*, c.name as client_name, c.email as client_email
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  static async getByClientId(clientId) {
    const result = await pool.query(
      `SELECT p.*, c.name as client_name, c.email as client_email
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       WHERE p.client_id = $1
       ORDER BY p.created_at DESC`,
      [clientId]
    );
    return result.rows;
  }

  static async getWithStats() {
    const result = await pool.query(`
      SELECT p.*, c.name as client_name, c.email as client_email,
             COUNT(t.id) as tasks_count,
             COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks_count,
             COALESCE(SUM(t.hours_logged), 0) as total_hours_logged
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id, c.name, c.email
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  }

  static async getProjectStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning_count,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN status = 'review' THEN 1 END) as review_count,
        COUNT(CASE WHEN status = 'done' THEN 1 END) as done_count,
        COALESCE(SUM(budget_amount), 0) as total_budget,
        COALESCE(AVG(budget_amount), 0) as average_budget
      FROM projects
    `);
    return result.rows[0];
  }

  static async searchProjects(searchTerm, status = null, clientId = null) {
    let query = `
      SELECT p.*, c.name as client_name, c.email as client_email
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      WHERE (p.title ILIKE $1 OR p.description ILIKE $1 OR c.name ILIKE $1)
    `;
    
    const params = [`%${searchTerm}%`];
    let paramCount = 2;

    if (status) {
      query += ` AND p.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (clientId) {
      query += ` AND p.client_id = $${paramCount}`;
      params.push(clientId);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }
}