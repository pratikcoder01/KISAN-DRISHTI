# KISAN-DRISHTI Backend API

**Smart Agricultural Market Intelligence Platform - Production-Grade Backend**

A robust, scalable, real-time backend system for India's agricultural market intelligence platform, built with Node.js, TypeScript, PostgreSQL, Redis, and WebSocket technology.

---

## 🌟 Features

### Core Capabilities
- ✅ **Real-Time Price Updates** - WebSocket broadcasts when admins update crop prices
- ✅ **Role-Based Access Control** - Separate farmer (device-based) and admin (JWT) authentication
- ✅ **Offline-First Architecture** - Versioned snapshots for offline sync
- ✅ **Multilingual Support** - English, Hindi, Marathi at database and API level
- ✅ **Voice Intelligence** - Intent-based voice command processing
- ✅ **Smart Advisory** - Trend analysis, profit calculator, optimal mandi suggestions
- ✅ **Audit Logging** - Immutable price update history with admin identity
- ✅ **Redis Caching** - Sub-second price lookups with intelligent invalidation
- ✅ **Production Ready** - Docker, PM2, health checks, structured logging

### Technical Highlights
- **TypeScript** - Full type safety across the stack
- **Prisma ORM** - Type-safe database queries and migrations
- **Socket.io** - Bi-directional real-time communication with fallback
- **Zod Validation** - Runtime type checking for API inputs
- **Winston Logging** - Structured JSON logs with rotation
- **Rate Limiting** - Redis-backed per-IP and per-user limits
- **Health Checks** - Database, Redis, and service status monitoring

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Farmers/Officials)      │
└──────────────┬──────────────────────────┘
               │ REST API / WebSocket
               ▼
┌─────────────────────────────────────────┐
│        Express.js API Gateway            │
│   Auth • Validation • Rate Limit • CORS │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┬───────────┐
    ▼          ▼          ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Price  │ │  User  │ │ Mandi  │ │Advisory│
│Service │ │Service │ │Service │ │Service │
└────────┘ └────────┘ └────────┘ └────────┘
    │          │          │           │
    └──────────┴──────────┴───────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌──────────┐ ┌──────┐ ┌──────────┐
│PostgreSQL│ │Redis │ │Socket.io │
└──────────┘ └──────┘ └──────────┘
```

---

## 📋 Prerequisites

- **Node.js** >= 20.0.0
- **PostgreSQL** >= 16.0
- **Redis** >= 7.0
- **Docker** (optional, recommended for deployment)
- **npm** >= 10.0.0

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd kisan-drishti-backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Minimum required environment variables:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/kisan_drishti
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
SESSION_SECRET=your-session-secret-key
ALLOWED_ORIGINS=http://localhost:8080
```

### 3. Database Setup

```bash
# Start PostgreSQL & Redis with Docker
docker-compose -f docker/docker-compose.yml up -d postgres redis

# Or install locally and start services
# sudo systemctl start postgresql redis

# Run migrations
npm run migrate

# Seed initial data (crops, mandis, admin user)
npm run seed
```

### 4. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Server will start on http://localhost:3000
```

### 5. Verify Installation

```bash
# Health check
curl http://localhost:3000/health

# Get current prices
curl http://localhost:3000/api/v1/prices

# Check API documentation
curl http://localhost:3000/
```

---

## 📦 Project Structure

```
kisan-drishti-backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── env.ts        # Environment validation
│   │   ├── database.ts   # Prisma client
│   │   └── redis.ts      # Redis client
│   │
│   ├── controllers/      # Request handlers
│   │   ├── price.controller.ts
│   │   ├── user.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── mandi.controller.ts
│   │   └── advisory.controller.ts
│   │
│   ├── services/         # Business logic
│   │   ├── price.service.ts
│   │   ├── user.service.ts
│   │   ├── advisory.service.ts
│   │   └── sync.service.ts
│   │
│   ├── repositories/     # Data access layer
│   │   ├── price.repository.ts
│   │   ├── user.repository.ts
│   │   └── mandi.repository.ts
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── routes/           # API routes
│   │   └── v1/
│   │       ├── price.routes.ts
│   │       ├── user.routes.ts
│   │       ├── admin.routes.ts
│   │       └── index.ts
│   │
│   ├── websocket/        # WebSocket handlers
│   │   ├── socket.server.ts
│   │   └── price.handler.ts
│   │
│   ├── utils/            # Helper utilities
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── validation.ts
│   │
│   ├── app.ts            # Express setup
│   └── server.ts         # Entry point
│
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration history
│   └── seed.ts           # Data seeder
│
├── tests/                # Test suites
├── docker/               # Docker configs
└── docs/                 # Documentation
```

---

## 🔌 API Endpoints

### Authentication

```bash
# Farmer registration (device-based)
POST /api/v1/users/register
Body: { "device_id": "uuid", "name": "Ramesh Kumar", "language": "hi" }

# Admin login
POST /api/v1/admin/login
Body: { "email": "admin@kisan-drishti.gov.in", "password": "***" }
```

### Prices

```bash
# Get current prices
GET /api/v1/prices?language=hi&mandi_id=<uuid>

# Get price history
GET /api/v1/prices/wheat/history?days=30

# Update prices (admin only)
POST /api/v1/admin/prices
Headers: Authorization: Bearer <admin_jwt>
Body: {
  "updates": [
    {
      "crop_code": "wheat",
      "price": 2450,
      "trend": { "direction": "up", "amount": 20 }
    }
  ]
}
```

### Mandis

```bash
# Find nearby mandis
GET /api/v1/mandis/nearby?lat=28.7041&lng=77.1025&radius=50

# Get mandi details
GET /api/v1/mandis/:id

# Get prices at specific mandi
GET /api/v1/mandis/:id/prices
```

### Advisory

```bash
# Profit calculator
GET /api/v1/advisory/profit-calculator?crop=wheat&quantity=100

# Best mandi recommendation
GET /api/v1/advisory/best-mandi?crop=wheat&location=28.7,77.1

# Selling advice
GET /api/v1/advisory/sell-timing?crop=wheat
```

### Voice Commands

```bash
# Process voice intent
POST /api/v1/voice/intent
Body: { "text": "आज गेहूं का भाव क्या है", "language": "hi" }
```

### Offline Sync

```bash
# Get data snapshot
GET /api/v1/sync/snapshot?since=v1234&language=hi

# Acknowledge sync
POST /api/v1/sync/acknowledge
Body: { "version": "v1234", "device_id": "uuid" }
```

---

## 🔥 WebSocket Events

### Connection

```javascript
// Client connects
const socket = io('ws://localhost:3000', {
  auth: { token: '<jwt_or_device_token>' }
});

// Server authenticates and joins rooms
socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Real-Time Price Updates

```javascript
// Listen for price updates
socket.on('price:update', (data) => {
  console.log('Price updated:', data);
  // {
  //   crop: 'wheat',
  //   price: 2450,
  //   trend: { direction: 'up', amount: 20 },
  //   mandi: { id: 'uuid', name: 'Azadpur' },
  //   updatedBy: { name: 'Raj Kumar', verified: true }
  // }
});

// Broadcast notifications
socket.on('notification:new', (data) => {
  console.log('New notification:', data);
});
```

---

## 🐳 Docker Deployment

### Build & Run

```bash
# Build backend image
npm run docker:build

# Start all services (Postgres, Redis, Backend)
npm run docker:up

# View logs
docker-compose -f docker/docker-compose.yml logs -f backend

# Stop services
npm run docker:down
```

### Production Deployment

```bash
# Build for production
npm run build

# Start with PM2 (process manager)
npm run start:prod

# Or run directly
NODE_ENV=production node dist/server.js
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- price.service.test.ts
```

---

## 📊 Monitoring & Logging

### Logs Location

```
logs/
├── combined.log      # All logs
├── error.log         # Error-only logs
├── exceptions.log    # Uncaught exceptions
└── rejections.log    # Unhandled promise rejections
```

### Health Check

```bash
curl http://localhost:3000/health

# Response:
{
  "status": "ok",
  "uptime": 12345.67,
  "environment": "production",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### PM2 Monitoring

```bash
# View process status
pm2 status

# Monitor in real-time
pm2 monit

# View logs
pm2 logs kisan-drishti-api

# Restart
pm2 restart kisan-drishti-api
```

---

## 🔒 Security Features

- **CORS** - Whitelist-based origin validation
- **Helmet** - Security headers (CSP, XSS protection)
- **Rate Limiting** - Redis-backed per-IP limits
- **JWT Authentication** - Secure admin access
- **Password Hashing** - bcrypt with 10 rounds
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma parameterized queries
- **Request Size Limits** - 10MB max payload

---

## 🌐 Multilingual Support

### Supported Languages
- **English (en)** - Default
- **Hindi (hi)** - हिंदी
- **Marathi (mr)** - मराठी

### Usage

```bash
# Get prices in Hindi
GET /api/v1/prices?language=hi

# Response will include:
{
  "crop": {
    "code": "wheat",
    "name": "गेहूँ",  # Localized name
    "emoji": "🌾"
  },
  "price": 2450
}
```

---

## 📈 Performance Optimization

### Caching Strategy

```
Price Data:     5 minutes TTL (frequent updates)
Mandi Data:     1 hour TTL (rarely changes)
User Sessions:  24 hours TTL
API Responses:  1 minute TTL (volatile data)
```

### Database Indexing

- Composite indexes on `(crop_id, mandi_id, valid_from)`
- GIS index on `(latitude, longitude)` for nearby search
- B-tree indexes on foreign keys

### Connection Pooling

- PostgreSQL: 20 connections
- Redis: Automatic connection management with retry

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U kisan_user -d kisan_drishti -h localhost

# View logs
tail -f logs/error.log
```

### Redis Connection Issues

```bash
# Check Redis status
redis-cli ping

# Connect to Redis
redis-cli
> KEYS kd:*
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## 📚 Additional Documentation

- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design details
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[Database Schema](./docs/DATABASE.md)** - Schema reference

---

## 🤝 Contributing

```bash
# Create feature branch
git checkout -b feature/your-feature

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Commit with conventional commits
git commit -m "feat: add new feature"
```

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built for **SPIT Hackathon 2026** - Smart Agricultural Solutions Track

**Team:** KISAN-DRISHTI Development Team  
**Goal:** Empowering farmers with real-time market intelligence

---

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@kisan-drishti.gov.in
- Documentation: `/docs`

---

**Version:** 1.0.0  
**Last Updated:** February 14, 2026  
**Status:** Production Ready ✅
