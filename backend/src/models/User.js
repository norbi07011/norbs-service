import pool from '../config/database.js';

export class User {
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, client_id, is_active, created_at FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0];
  }

  static async create(userData) {
    const { name, email, passwordHash, role, clientId } = userData;
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, client_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, role, client_id, created_at`,
      [name, email, passwordHash, role, clientId]
    );
    return result.rows[0];
  }

  static async update(id, userData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} 
       WHERE id = $${paramCount} AND is_active = true
       RETURNING id, name, email, role, client_id, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query(
      'UPDATE users SET is_active = false WHERE id = $1',
      [id]
    );
  }

  static async getAll() {
    const result = await pool.query(
      'SELECT id, name, email, role, client_id, created_at FROM users WHERE is_active = true ORDER BY created_at DESC'
    );
    return result.rows;
  }
}