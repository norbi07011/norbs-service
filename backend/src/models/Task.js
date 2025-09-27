import pool from '../config/database.js';

export class Task {
  static async findById(id) {
    const result = await pool.query(
      `SELECT t.*, p.title as project_title, p.client_id, c.name as client_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(taskData) {
    const {
      projectId, title, description, status, dueDate, hoursLogged
    } = taskData;

    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, status, due_date, hours_logged)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [projectId, title, description, status || 'pending', dueDate, hoursLogged || 0]
    );
    return result.rows[0];
  }

  static async update(id, taskData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Map camelCase to snake_case for database fields
    const fieldMap = {
      projectId: 'project_id',
      dueDate: 'due_date',
      hoursLogged: 'hours_logged'
    };

    Object.entries(taskData).forEach(([key, value]) => {
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
      `UPDATE tasks SET ${fields.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  static async getByProjectId(projectId) {
    const result = await pool.query(
      `SELECT t.*, p.title as project_title
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE t.project_id = $1
       ORDER BY t.created_at DESC`,
      [projectId]
    );
    return result.rows;
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT t.*, p.title as project_title, p.client_id, c.name as client_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       ORDER BY t.created_at DESC`
    );
    return result.rows;
  }

  static async getTaskStats(projectId = null) {
    let query = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COALESCE(SUM(hours_logged), 0) as total_hours_logged,
        COALESCE(AVG(hours_logged), 0) as average_hours_logged
      FROM tasks
    `;
    
    const params = [];
    if (projectId) {
      query += ' WHERE project_id = $1';
      params.push(projectId);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async getOverdueTasks() {
    const result = await pool.query(
      `SELECT t.*, p.title as project_title, p.client_id, c.name as client_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       WHERE t.due_date < CURRENT_DATE AND t.status = 'pending'
       ORDER BY t.due_date ASC`
    );
    return result.rows;
  }

  static async getTasksByUser(userId) {
    // For now, we don't have user assignment to tasks
    // This would be implemented when we add assigned_user_id to tasks table
    const result = await pool.query(
      `SELECT t.*, p.title as project_title, p.client_id, c.name as client_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       ORDER BY t.created_at DESC`
    );
    return result.rows;
  }
}