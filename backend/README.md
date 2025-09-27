# NORBS SERVICE Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup PostgreSQL database:**
   ```sql
   CREATE DATABASE norbs_service_dev;
   CREATE USER norbs_user WITH PASSWORD 'norbs_password';
   GRANT ALL PRIVILEGES ON DATABASE norbs_service_dev TO norbs_user;
   ```

4. **Run migrations and seed data:**
   ```bash
   npm run migrate
   npm run seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Test Accounts
- **Owner:** `owner@norbs.nl` / `admin123`
- **Client:** `client@example.com` / `client123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Clients (Owner only)
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

## 🔧 Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=norbs_service_dev
DB_USER=norbs_user
DB_PASSWORD=norbs_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173
```

## 🗄️ Database Schema

### Users
- Authentication and user management
- Roles: owner, client
- JWT token-based auth

### Clients
- Client information and contact details
- Multi-language support
- Project relationships

### Projects
- Project management with status tracking
- Budget management (fixed/hourly)
- Client relationships

### Tasks
- Task management per project
- Time tracking
- Status management

### Files
- File upload and management
- Project-related file storage
- Version control

### Invoices
- Invoice generation and management
- Line items support
- Status tracking

### Activities
- Audit log for user actions
- JSON metadata support

## 🛡️ Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection

## 📈 Performance Features

- Database connection pooling
- Response compression
- Request logging
- Health check endpoint
- Graceful shutdown

## 🧪 Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with test data
- `npm test` - Run tests

### Database Commands
```bash
# Reset database
npm run migrate
npm run seed

# Check migrations
psql -d norbs_service_dev -c "SELECT * FROM migrations;"
```

### API Testing
```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@norbs.nl","password":"admin123"}'
```

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure PostgreSQL production database
4. Set up SSL/TLS
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

### Docker Support (Coming Soon)
- Dockerfile for containerization
- Docker Compose for full stack deployment
- Production-ready configuration

## 🔄 Migration to Real Backend

This backend is now ready to replace the mock data system in the frontend. Next steps:

1. Update frontend API calls to use real endpoints
2. Replace localStorage auth with JWT tokens
3. Implement file upload functionality
4. Add email service integration
5. Set up production deployment

## 📞 Support

For issues and questions, contact the development team or check the main project README.