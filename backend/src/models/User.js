import pool from '../config/database.js';

// Mock data for when database is not available
const mockUsers = [
  {
    id: '1',
    name: 'Admin',
    email: 'owner@norbs.nl',
    password_hash: '$2a$12$1uPxDOC1XKBkIVdEyZ6uDOH4zUQwuqw8qP1Hf2N7l.DU3yl5Tbs9C', // admin123
    role: 'owner',
    client_id: null,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Test Client',
    email: 'client@example.com',
    password_hash: '$2a$12$1uPxDOC1XKBkIVdEyZ6uDOH4zUQwuqw8qP1Hf2N7l.DU3yl5Tbs9C', // client123 (same hash for simplicity)
    role: 'client',
    client_id: '1',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Check if database is available
const isDatabaseAvailable = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
};

export class User {
  static async findById(id) {
    // Try database first, fallback to mock
    try {
      if (await isDatabaseAvailable()) {
        const result = await pool.query(
          'SELECT id, name, email, role, client_id, is_active, created_at FROM users WHERE id = $1 AND is_active = true',
          [id]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log('🔄 Using mock data for User.findById');
    }
    
    // Mock mode
    return mockUsers.find(user => user.id === id && user.is_active);
  }

  static async findByEmail(email) {
    // Try database first, fallback to mock
    try {
      if (await isDatabaseAvailable()) {
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1 AND is_active = true',
          [email]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log('🔄 Using mock data for User.findByEmail');
    }
    
    // Mock mode
    return mockUsers.find(user => user.email === email && user.is_active);
  }

  static async create(userData) {
    // Try database first, fallback to mock
    try {
      if (await isDatabaseAvailable()) {
        const { name, email, passwordHash, role, clientId } = userData;
        const result = await pool.query(
          `INSERT INTO users (name, email, password_hash, role, client_id) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING id, name, email, role, client_id, created_at`,
          [name, email, passwordHash, role, clientId]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log('🔄 Using mock data for User.create');
    }
    
    // Mock mode - simulate user creation
    const newUser = {
      id: String(mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      password_hash: userData.passwordHash,
      role: userData.role || 'client',
      client_id: userData.clientId || null,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      client_id: newUser.client_id,
      created_at: newUser.created_at
    };
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