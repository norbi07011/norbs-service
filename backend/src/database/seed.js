import pool from './pool.js';
import bcrypt from 'bcryptjs';

const seedData = {
  users: [
    {
      name: 'Admin',
      email: 'owner@norbs.nl',
      password: 'admin123', // Will be hashed
      role: 'owner'
    },
    {
      name: 'Test Client',
      email: 'client@example.com',
      password: 'client123', // Will be hashed
      role: 'client'
    }
  ],
  clients: [
    {
      name: 'Innovate Inc.',
      email: 'contact@innovate.com',
      phone: '+123456789',
      language: 'en',
      notes: 'Primary contact is Jane Doe. Interested in Q3 campaign.',
      address: '123 Tech Avenue',
      city: 'Silicon Valley',
      zip_code: '94043',
      country: 'USA',
      vat_number: 'US123456789'
    },
    {
      name: 'Future Gadgets',
      email: 'hello@futuregadgets.com',
      phone: '+987654321',
      language: 'nl',
      notes: 'Needs multilingual marketing materials.',
      address: 'Innovation Street 456',
      city: 'Amsterdam',
      zip_code: '1012AB',
      country: 'Netherlands',
      vat_number: 'NL123456789B01'
    }
  ],
  projects: [
    {
      title: 'Q3 Social Media Campaign',
      description: 'Comprehensive social media marketing campaign for Q3 2025',
      status: 'in-progress',
      priority: 'high',
      budget_type: 'fixed',
      budget_amount: 5000.00,
      start_date: '2025-07-01',
      end_date: '2025-09-30'
    },
    {
      title: 'E-commerce Website Redesign',
      description: 'Complete redesign of the company website with modern UX',
      status: 'review',
      priority: 'medium',
      budget_type: 'hourly',
      budget_amount: 75.00,
      start_date: '2025-06-15',
      end_date: '2025-08-15'
    }
  ],
  tasks: [
    {
      title: 'Social Media Strategy Document',
      description: 'Create comprehensive social media strategy document',
      status: 'completed',
      due_date: '2025-07-15',
      hours_logged: 8.5
    },
    {
      title: 'Design Instagram Post Templates',
      description: 'Create 10 Instagram post templates for the campaign',
      status: 'pending',
      due_date: '2025-07-30',
      hours_logged: 0
    },
    {
      title: 'Website Wireframes',
      description: 'Create wireframes for all main pages',
      status: 'completed',
      due_date: '2025-07-01',
      hours_logged: 12.0
    }
  ]
};

export async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Check if data already exists
    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('⏭️  Database already seeded, skipping...');
      await client.query('ROLLBACK');
      return;
    }

    console.log('🌱 Seeding database...');

    // Insert clients first
    const clientIds = [];
    for (const clientData of seedData.clients) {
      const result = await client.query(
        `INSERT INTO clients (name, email, phone, language, notes, address, city, zip_code, country, vat_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          clientData.name,
          clientData.email,
          clientData.phone,
          clientData.language,
          clientData.notes,
          clientData.address,
          clientData.city,
          clientData.zip_code,
          clientData.country,
          clientData.vat_number
        ]
      );
      clientIds.push(result.rows[0].id);
    }

    // Insert users
    const userIds = [];
    for (let i = 0; i < seedData.users.length; i++) {
      const userData = seedData.users[i];
      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      const result = await client.query(
        `INSERT INTO users (name, email, password_hash, role, client_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [
          userData.name,
          userData.email,
          passwordHash,
          userData.role,
          userData.role === 'client' ? clientIds[i - 1] : null // First user is owner, second is client
        ]
      );
      userIds.push(result.rows[0].id);
    }

    // Insert projects
    const projectIds = [];
    for (let i = 0; i < seedData.projects.length; i++) {
      const projectData = seedData.projects[i];
      const result = await client.query(
        `INSERT INTO projects (title, description, status, priority, budget_type, budget_amount, client_id, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          projectData.title,
          projectData.description,
          projectData.status,
          projectData.priority,
          projectData.budget_type,
          projectData.budget_amount,
          clientIds[i], // Assign projects to clients
          projectData.start_date,
          projectData.end_date
        ]
      );
      projectIds.push(result.rows[0].id);
    }

    // Insert tasks
    for (let i = 0; i < seedData.tasks.length; i++) {
      const taskData = seedData.tasks[i];
      await client.query(
        `INSERT INTO tasks (project_id, title, description, status, due_date, hours_logged)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          projectIds[i < 2 ? 0 : 1], // First 2 tasks for project 1, rest for project 2
          taskData.title,
          taskData.description,
          taskData.status,
          taskData.due_date,
          taskData.hours_logged
        ]
      );
    }

    // Insert some sample activities
    const activities = [
      {
        user_id: userIds[0],
        user_name: 'Admin',
        action: 'created project "Q3 Social Media Campaign"',
        meta: { project_id: projectIds[0] }
      },
      {
        user_id: userIds[0],
        user_name: 'Admin',
        action: 'uploaded file "Campaign-Brief-v2.pdf"',
        meta: { project_id: projectIds[0] }
      },
      {
        user_id: userIds[1],
        user_name: 'Test Client',
        action: 'logged in',
        meta: {}
      }
    ];

    for (const activity of activities) {
      await client.query(
        `INSERT INTO activities (user_id, user_name, action, meta)
         VALUES ($1, $2, $3, $4)`,
        [activity.user_id, activity.user_name, activity.action, JSON.stringify(activity.meta)]
      );
    }

    await client.query('COMMIT');
    
    console.log('✅ Database seeded successfully!');
    console.log('👤 Test accounts:');
    console.log('   Owner: owner@norbs.nl / admin123');
    console.log('   Client: client@example.com / client123');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}