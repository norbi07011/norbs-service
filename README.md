# NORBS SERVICE - Premium Marketing Platform

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🚀 Full-Stack Marketing Platform

A comprehensive marketing agency platform with React frontend and Node.js backend, featuring client management, project tracking, AI-powered blog generation, and multi-language support.

### ✨ Key Features

- **🎨 Modern UI/UX** - 3D glass cards, dark/light/premium themes, responsive design
- **🔐 Authentication System** - JWT-based auth with role-based access control
- **👥 Client Management** - Complete CRM for managing clients and projects  
- **📊 Admin Dashboard** - Statistics, task management, invoicing
- **🤖 AI Blog Generator** - Google Gemini AI-powered content creation
- **🌍 Multi-Language** - Support for 6 languages (NL, EN, TR, PL, DE, FR)
- **📱 Mobile Responsive** - Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Google Gemini AI** integration

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT** authentication
- **bcrypt** password hashing
- **Winston** logging
- **Rate limiting** & security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Option 1: Full Setup (Recommended)
```bash
# Clone and setup everything
git clone <repository>
cd norbs-service---premium-marketing

# Install all dependencies and setup database
npm run setup

# Start both frontend and backend
npm run dev:full
```

### Option 2: Frontend Only (Mock Data)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Option 3: Manual Setup
```bash
# Install frontend dependencies
npm install

# Setup backend
npm run backend:install

# Create PostgreSQL database
createdb norbs_service_dev

# Run migrations and seed data
npm run backend:migrate
npm run backend:seed

# Start backend (in one terminal)
npm run backend:dev

# Start frontend (in another terminal) 
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:3001/api
VITE_USE_REAL_API=false
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key
```

**Backend (backend/.env):**
```bash
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_NAME=norbs_service_dev
DB_USER=norbs_user
DB_PASSWORD=norbs_password
JWT_SECRET=your-super-secret-jwt-key
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Clients (Owner only)
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

## 👤 Test Accounts

- **Owner:** `owner@norbs.nl` / `admin123`
- **Client:** `client@example.com` / `client123`

## 🗂️ Project Structure

```
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── config/            # Configuration files
│   └── translations/      # Multi-language support
├── backend/               # Backend source
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── database/      # Migrations & seeds
└── public/               # Static assets
```

## 🔄 Migration from Mock to Real API

The platform supports both mock data (for development) and real API:

1. **Mock Mode (Default):** Set `VITE_USE_REAL_API=false`
2. **Real API Mode:** Set `VITE_USE_REAL_API=true`

This allows seamless transition without breaking existing functionality.

## ✅ Current Features Status

### ✅ Completed
- Complete frontend with all pages
- Authentication system (JWT)
- Client management API  
- Database schema & migrations
- Multi-language support
- AI blog generation
- Responsive design
- Security middleware

### 🔄 In Progress  
- Project management API
- Task management API
- File upload system
- Invoice management
- Email notifications

### 📋 Planned
- Payment integration (Stripe)
- Real-time notifications
- Advanced analytics
- Mobile PWA
- Performance optimization

## 🚢 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend
```bash
cd backend
npm start
# Configure reverse proxy (nginx) and SSL
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch  
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: servicenorbs@gmail.com
- WhatsApp: +31 6 42474314
- Tel: +31 6 42474314

---

**NORBS SERVICE** - Premium Marketing Solutions 2025
