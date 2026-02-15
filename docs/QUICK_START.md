# KISAN-DRISHTI Backend - Quick Start Guide

🚀 **Get the production-grade backend running in 5 minutes!**

---

## Prerequisites Check

```bash
# Check Node.js (need >= 20.0.0)
node --version

# Check PostgreSQL (need >= 16.0)
psql --version

# Check Redis (need >= 7.0)
redis-cli --version

# Check Docker (optional but recommended)
docker --version
```

---

## Installation Methods

### Option 1: Docker (Recommended - Fastest)

```bash
# 1. Navigate to project
cd kisan-drishti-backend

# 2. Create environment file
cp .env.example .env

# 3. Edit .env with your secrets (REQUIRED!)
nano .env
# At minimum, set:
# - JWT_SECRET (32+ chars)
# - SESSION_SECRET (16+ chars)
# - DB_PASSWORD

# 4. Start everything with Docker
cd docker
docker-compose up -d

# 5. Check health
curl http://localhost:3000/health

# 6. View logs
docker-compose logs -f backend
```

**That's it! API is running on http://localhost:3000**

---

### Option 2: Local Development

```bash
# 1. Navigate to project
cd kisan-drishti-backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
nano .env  # Edit with your values

# 4. Start PostgreSQL & Redis locally
# Ubuntu/Debian:
sudo systemctl start postgresql redis

# macOS with Homebrew:
brew services start postgresql redis

# Or use Docker for just the databases:
cd docker
docker-compose up -d postgres redis

# 5. Run database migrations
npm run migrate

# 6. Seed initial data (crops, mandis, admin user)
npm run seed

# 7. Start development server
npm run dev

# Server running on http://localhost:3000
```

---

## Verify Installation

```bash
# 1. Health check
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "ok",
#   "services": {
#     "database": "healthy",
#     "redis": "healthy"
#   }
# }

# 2. Get API info
curl http://localhost:3000/

# 3. Test prices endpoint
curl http://localhost:3000/api/v1/prices

# 4. Test admin login (uses seeded admin)
curl -X POST http://localhost:3000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kisan-drishti.gov.in",
    "password": "ChangeMeInProduction!123"
  }'
```

---

## Default Credentials

**Admin User** (created by seeder):
- Email: `admin@kisan-drishti.gov.in`
- Password: `ChangeMeInProduction!123`

⚠️ **IMPORTANT:** Change this password immediately in production!

---

## Common Issues & Fixes

### Database Connection Failed

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in .env
DATABASE_URL=postgresql://kisan_user:password@localhost:5432/kisan_drishti

# Test direct connection
psql -U kisan_user -d kisan_drishti -h localhost
```

### Redis Connection Failed

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Check .env
REDIS_URL=redis://localhost:6379
```

### Port 3000 Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Migration Errors

```bash
# Reset database (WARNING: Deletes all data!)
npm run prisma:reset

# Or manually drop and recreate
psql -U postgres
DROP DATABASE kisan_drishti;
CREATE DATABASE kisan_drishti;
\q

# Then re-run migrations
npm run migrate
npm run seed
```

---

## Next Steps

### Test the API

```bash
# 1. Register a farmer
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "test-device-123",
    "name": "Ramesh Kumar",
    "language": "hi",
    "location": { "lat": 28.7041, "lng": 77.1025 }
  }'
# Save the token from response!

# 2. Get prices (with token)
curl http://localhost:3000/api/v1/prices?language=hi \
  -H "Authorization: Bearer <your-farmer-token>"

# 3. Find nearby mandis
curl "http://localhost:3000/api/v1/mandis/nearby?lat=28.7041&lng=77.1025"
```

### Update Prices (Admin)

```bash
# 1. Login as admin
TOKEN=$(curl -X POST http://localhost:3000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kisan-drishti.gov.in",
    "password": "ChangeMeInProduction!123"
  }' | jq -r '.data.token')

# 2. Update wheat price
curl -X POST http://localhost:3000/api/v1/admin/prices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [{
      "crop_code": "wheat",
      "price": 2500,
      "trend": { "direction": "up", "amount": 50 }
    }]
  }'
```

### Test WebSocket

Create `test-websocket.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>
<body>
  <h1>WebSocket Test</h1>
  <div id="messages"></div>
  
  <script>
    const socket = io('http://localhost:3000', {
      auth: { token: 'YOUR_FARMER_TOKEN_HERE' }
    });
    
    socket.on('connect', () => {
      console.log('Connected!');
      document.getElementById('messages').innerHTML += '<p>✅ Connected</p>';
    });
    
    socket.on('price:update', (data) => {
      console.log('Price update:', data);
      document.getElementById('messages').innerHTML += 
        `<p>📊 ${data.crop} price: ₹${data.price}</p>`;
    });
  </script>
</body>
</html>
```

Open in browser, then update prices via admin API - you'll see real-time updates!

---

## Development Tools

```bash
# Watch mode (auto-restart on changes)
npm run dev

# View Prisma Studio (database GUI)
npm run prisma:studio
# Opens at http://localhost:5555

# Check logs
tail -f logs/combined.log

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

---

## Production Deployment

```bash
# 1. Build TypeScript
npm run build

# 2. Start with PM2
npm run start:prod

# 3. View PM2 dashboard
pm2 monit

# 4. View logs
pm2 logs kisan-drishti-api

# 5. Restart
pm2 restart kisan-drishti-api
```

---

## Documentation

- **Architecture:** See `BACKEND_ARCHITECTURE.md`
- **API Reference:** See `API_REFERENCE.md`
- **Full README:** See `README.md`
- **Implementation:** See `IMPLEMENTATION_GUIDE.md`

---

## Support

Having issues? Check:

1. Environment variables are set correctly
2. PostgreSQL & Redis are running
3. Migrations have been run
4. Check logs in `logs/` directory

Still stuck? The error logs in `logs/error.log` usually have the answer!

---

**Happy Coding! 🚀**

The backend is production-ready with:
- ✅ Real-time WebSocket updates
- ✅ Role-based authentication
- ✅ Redis caching
- ✅ Multilingual support
- ✅ Offline sync
- ✅ Voice intelligence
- ✅ Audit logging
- ✅ Health monitoring

Built for **SPIT Hackathon 2026** - Empowering India's farmers! 🌾
