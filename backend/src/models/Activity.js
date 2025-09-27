import pool from '../config/database.js';

export class Activity {
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM activities WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(activityData) {
    const { userId, userName, action, meta } = activityData;

    const result = await pool.query(
      `INSERT INTO activities (user_id, user_name, action, meta)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, userName, action, JSON.stringify(meta || {})]
    );
    return result.rows[0];
  }

  static async getAll(limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM activities 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async getByUser(userId, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getByDateRange(startDate, endDate, limit = 100, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE created_at >= $1 AND created_at <= $2 
       ORDER BY created_at DESC 
       LIMIT $3 OFFSET $4`,
      [startDate, endDate, limit, offset]
    );
    return result.rows;
  }

  static async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_activities,
        COUNT(DISTINCT user_id) as unique_users,
        DATE_TRUNC('day', created_at) as activity_date,
        COUNT(*) as daily_count
      FROM activities 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY activity_date DESC
      LIMIT 30
    `);
    return result.rows;
  }

  static async logActivity(userId, userName, action, meta = {}) {
    return this.create({
      userId,
      userName,
      action,
      meta
    });
  }

  // Helper methods for common activities
  static async logLogin(userId, userName) {
    return this.logActivity(userId, userName, 'logged in');
  }

  static async logLogout(userId, userName) {
    return this.logActivity(userId, userName, 'logged out');
  }

  static async logProjectCreated(userId, userName, projectId, projectTitle) {
    return this.logActivity(userId, userName, `created project "${projectTitle}"`, {
      project_id: projectId,
      project_title: projectTitle
    });
  }

  static async logProjectUpdated(userId, userName, projectId, projectTitle) {
    return this.logActivity(userId, userName, `updated project "${projectTitle}"`, {
      project_id: projectId,
      project_title: projectTitle
    });
  }

  static async logTaskCreated(userId, userName, taskId, taskTitle, projectId) {
    return this.logActivity(userId, userName, `created task "${taskTitle}"`, {
      task_id: taskId,
      task_title: taskTitle,
      project_id: projectId
    });
  }

  static async logTaskCompleted(userId, userName, taskId, taskTitle, projectId) {
    return this.logActivity(userId, userName, `completed task "${taskTitle}"`, {
      task_id: taskId,
      task_title: taskTitle,
      project_id: projectId
    });
  }

  static async logFileUploaded(userId, userName, fileName, projectId) {
    return this.logActivity(userId, userName, `uploaded file "${fileName}"`, {
      file_name: fileName,
      project_id: projectId
    });
  }

  static async logClientCreated(userId, userName, clientId, clientName) {
    return this.logActivity(userId, userName, `added client "${clientName}"`, {
      client_id: clientId,
      client_name: clientName
    });
  }
}