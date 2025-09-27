import pool from '../config/database.js';

export class Client {
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(clientData) {
    const {
      name, email, phone, language, notes, address,
      city, zipCode, country, vatNumber
    } = clientData;

    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, language, notes, address, city, zip_code, country, vat_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, email, phone, language, notes, address, city, zipCode, country, vatNumber]
    );
    return result.rows[0];
  }

  static async update(id, clientData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Map camelCase to snake_case for database fields
    const fieldMap = {
      zipCode: 'zip_code',
      vatNumber: 'vat_number'
    };

    Object.entries(clientData).forEach(([key, value]) => {
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
      `UPDATE clients SET ${fields.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
  }

  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async getWithProjectsCount() {
    const result = await pool.query(`
      SELECT c.*, 
             COUNT(p.id) as projects_count,
             COUNT(CASE WHEN p.status = 'in-progress' THEN 1 END) as active_projects_count
      FROM clients c
      LEFT JOIN projects p ON c.id = p.client_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  }
}