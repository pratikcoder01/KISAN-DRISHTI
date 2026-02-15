# KISAN-DRISHTI - Installation & Setup Guide

## 📦 What You Have

A complete full-stack application with:
- ✅ **Frontend:** HTML/CSS/JavaScript with Tailwind
- ✅ **Backend:** Node.js/TypeScript with Express
- ✅ **Database:** PostgreSQL with Prisma ORM
- ✅ **Cache:** Redis for performance
- ✅ **Real-time:** WebSocket with Socket.io
- ✅ **Deployment:** Docker-ready with docker-compose

---

## 🚀 Quick Setup (Choose One Method)

### Method 1: Docker (Recommended) ⚡
**Time:** 5 minutes | **Difficulty:** Easy

#### Prerequisites
- Docker Desktop installed
- 4GB RAM available
- Ports 3000, 5432, 6379, 8080 available

#### Steps
```bash
# 1. Extract the zip file
unzip KISAN-DRISHTI-COMPLETE.zip
cd KISAN-DRISHTI-FULL-STACK

# 2. Setup backend environment
cd backend
cp .env.example .env
# Edit .env and set at minimum:
# JWT_SECRET=your-secret-key-min-32-characters-long
# SESSION_SECRET=your-session-secret-key-16chars

# 3. Start all services with Docker
cd docker
docker-compose up -d

# 4. Wait 30 seconds for initialization
sleep 30

# 5. Check backend health
curl http://localhost:3000/health
# Should return: {"status":"ok",...}

# 6. Start frontend (new terminal)
cd ../../frontend
python3 -m http.server 8080
# Or: npx serve .

# 7. Open browser
# Frontend: http://localhost:8080
# Backend: http://localhost:3000
```

**Done! ✅ Both frontend and backend are running.**

---

### Method 2: Local Development
**Time:** 15 minutes | **Difficulty:** Medium

#### Prerequisites
- Node.js 20+ installed
- PostgreSQL 16+ installed and running
- Redis 7+ installed and running
- Python 3 (for frontend server)

#### Steps

**Backend Setup:**
```bash
cd KISAN-DRISHTI-FULL-STACK/backend

# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
nano .env  # Edit required variables

# 3. Ensure PostgreSQL is running
sudo systemctl start postgresql
# Or macOS: brew services start postgresql

# 4. Create database
psql -U postgres
CREATE DATABASE kisan_drishti;
CREATE USER kisan_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kisan_drishti TO kisan_user;
\q

# 5. Run migrations
npm run migrate

# 6. Seed database (creates crops, mandis, admin user)
npm run seed

# 7. Ensure Redis is running
sudo systemctl start redis
# Or macOS: brew services start redis

# 8. Start backend
npm run dev

# Backend running on http://localhost:3000
```

**Frontend Setup (New Terminal):**
```bash
cd KISAN-DRISHTI-FULL-STACK/frontend

# Start local server
python3 -m http.server 8080
# Or: npx serve .

# Frontend running on http://localhost:8080
```

---

## ✅ Verify Installation

### 1. Backend Health Check
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-14T10:30:00Z",
  "uptime": 123.45,
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### 2. Test API
```bash
# Get current prices
curl http://localhost:3000/api/v1/prices

# Should return list of crops with prices
```

### 3. Test Frontend
1. Open http://localhost:8080
2. Should see landing page with "Farmer" and "Market Official" options
3. Click "Continue as Farmer"
4. Should navigate to onboarding page

### 4. Test Admin Login
```bash
curl -X POST http://localhost:3000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kisan-drishti.gov.in",
    "password": "ChangeMeInProduction!123"
  }'
```

**Expected:** Should return token and user info

---

## 🎯 Default Credentials

**Admin Account** (created by seeder):
- **Email:** `admin@kisan-drishti.gov.in`
- **Password:** `ChangeMeInProduction!123`

⚠️ **IMPORTANT:** Change this password before deploying to production!

To change:
```bash
cd backend
npm run prisma:studio
# Opens database GUI at http://localhost:5555
# Navigate to users table and update password
```

---

## 🔧 Configuration

### Required Environment Variables

Edit `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database (REQUIRED)
DATABASE_URL=postgresql://kisan_user:your_password@localhost:5432/kisan_drishti

# Redis (REQUIRED)
REDIS_URL=redis://localhost:6379

# Security (REQUIRED - Change these!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-please
SESSION_SECRET=your-session-secret-minimum-16-characters

# CORS (REQUIRED)
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3001

# Features (Optional)
ENABLE_WEBSOCKET=true
ENABLE_VOICE=true
ENABLE_AUDIT_LOGS=true

# Admin Defaults
DEFAULT_ADMIN_EMAIL=admin@kisan-drishti.gov.in
DEFAULT_ADMIN_PASSWORD=ChangeMeInProduction!123
```

### Frontend Configuration

If your backend is on a different URL, edit `frontend/js/main.js`:

```javascript
// Find this line and update:
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

---

## 📖 User Guide

### For Farmers

1. **Access Platform:** http://localhost:8080
2. **Select Role:** Click "Continue as Farmer"
3. **Onboarding:** 
   - Enter your name
   - Select language (English/Hindi/Marathi)
   - Allow location access
4. **Dashboard:** View real-time crop prices
5. **Voice Command:** Click microphone icon, speak in your language
6. **Profit Calculator:** Calculate earnings from crops
7. **Mandi Locator:** Find nearest markets

### For Admin/Officials

1. **Login:** http://localhost:8080 → "Continue as Market Official"
2. **Credentials:** 
   - Email: admin@kisan-drishti.gov.in
   - Password: ChangeMeInProduction!123
3. **Update Prices:** Navigate to price management
4. **View Analytics:** Check farmer statistics
5. **Audit Logs:** Review all price changes

---

## 🧪 Test the Complete Flow

### End-to-End Test (5 minutes)

**Terminal 1 - Start Services:**
```bash
# With Docker
cd backend/docker && docker-compose up -d

# Or manually
cd backend && npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
python3 -m http.server 8080
```

**Browser - Farmer Flow:**
1. Open http://localhost:8080
2. Click "Continue as Farmer"
3. Complete onboarding
4. View dashboard with prices
5. Leave this tab open

**Terminal 3 - Update Price as Admin:**
```bash
# Login
TOKEN=$(curl -X POST http://localhost:3000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kisan-drishti.gov.in",
    "password": "ChangeMeInProduction!123"
  }' | jq -r '.data.token')

# Update wheat price
curl -X POST http://localhost:3000/api/v1/admin/prices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [{
      "crop_code": "wheat",
      "price": 2600,
      "trend": {
        "direction": "up",
        "amount": 100
      }
    }]
  }'
```

**Browser - Watch Farmer Dashboard:**
- Price should update automatically via WebSocket! 🔥
- No page refresh needed

**Success!** You've just demonstrated real-time price broadcasting.

---

## 🐛 Common Issues

### Issue: "Database connection failed"

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
psql -U postgres -c "\l" | grep kisan_drishti

# If not, create it
psql -U postgres -c "CREATE DATABASE kisan_drishti;"

# Re-run migrations
cd backend && npm run migrate
```

---

### Issue: "Redis connection failed"

**Solution:**
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# If not running
sudo systemctl start redis
# Or macOS: brew services start redis
```

---

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=3001
```

---

### Issue: "Frontend can't connect to backend"

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:3000/health

# 2. Check CORS settings in backend/.env
ALLOWED_ORIGINS=http://localhost:8080

# 3. Check browser console for errors
# Open DevTools (F12) → Console tab

# 4. Verify API URL in frontend/js/main.js
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

---

### Issue: "WebSocket not connecting"

**Solution:**
```bash
# Check WebSocket is enabled
cat backend/.env | grep WEBSOCKET
# Should show: ENABLE_WEBSOCKET=true

# Check browser console
# Should see: "WebSocket connected" or similar message

# Test WebSocket manually
npm install -g wscat
wscat -c ws://localhost:3000
```

---

### Issue: "Migration errors"

**Solution:**
```bash
cd backend

# Reset database (⚠️ Deletes all data!)
npm run prisma:reset

# Or manually
psql -U postgres
DROP DATABASE kisan_drishti;
CREATE DATABASE kisan_drishti;
\q

# Re-run migrations
npm run migrate
npm run seed
```

---

## 📊 View Data

### Prisma Studio (Database GUI)

```bash
cd backend
npm run prisma:studio

# Opens at http://localhost:5555
```

You can:
- View all tables
- Edit records
- Add test data
- Change admin password

---

## 🚀 Production Deployment

### Docker Production

```bash
cd backend/docker

# Edit docker-compose.yml for production settings
# Update .env with production secrets

# Start in production mode
NODE_ENV=production docker-compose up -d

# View logs
docker-compose logs -f
```

### PM2 Production

```bash
cd backend

# Build TypeScript
npm run build

# Start with PM2
npm run start:prod

# View status
pm2 status

# View logs
pm2 logs kisan-drishti-api

# Monitor
pm2 monit
```

### Frontend Production

```bash
# Option 1: Copy to web root
sudo cp -r frontend/* /var/www/html/

# Option 2: Serve with Nginx
# See backend/docker/nginx.conf for configuration
```

---

## 📚 Documentation

Comprehensive documentation is in the `docs/` folder:

| Document | Description |
|----------|-------------|
| `README.md` | This file |
| `docs/BACKEND_ARCHITECTURE.md` | Complete system design (45 pages) |
| `docs/API_REFERENCE.md` | API documentation (22 pages) |
| `docs/QUICK_START.md` | Fast setup guide (6 pages) |
| `docs/PROJECT_SUMMARY.md` | Executive overview (10 pages) |

---

## 🎓 Learning Path

**Day 1 - Setup & Basics**
1. Get everything running with Docker
2. Explore frontend pages
3. Test API endpoints with curl

**Day 2 - Understanding Flow**
1. Read `docs/BACKEND_ARCHITECTURE.md`
2. Trace a request from frontend to database
3. Examine WebSocket implementation

**Day 3 - Customization**
1. Add a new crop to database
2. Create a new API endpoint
3. Add a new frontend page

**Day 4 - Advanced**
1. Implement a new feature
2. Write tests
3. Deploy to production

---

## 🤝 Getting Help

**Logs Location:**
- Backend: `backend/logs/combined.log`
- Backend Errors: `backend/logs/error.log`
- Docker: `docker-compose logs -f`

**Debugging:**
1. Check health endpoint: `curl http://localhost:3000/health`
2. Check browser console (F12)
3. Check backend logs
4. Verify environment variables
5. Ensure all services running (PostgreSQL, Redis)

**Common Commands:**
```bash
# Check all services
docker-compose ps

# Restart backend
pm2 restart kisan-drishti-api

# View database
npm run prisma:studio

# Test API
curl http://localhost:3000/api/v1/prices
```

---

## ✅ Success Criteria

You'll know everything is working when:

- ✅ Health check returns `"status": "ok"`
- ✅ Frontend loads at http://localhost:8080
- ✅ Farmer can register and view prices
- ✅ Admin can login and update prices
- ✅ Prices update in real-time on farmer dashboard
- ✅ Voice commands work
- ✅ Mandi locator shows nearby markets
- ✅ Profit calculator computes earnings

---

## 🎯 Next Steps

1. **Customize:** Add your crops, mandis, features
2. **Integrate:** Connect to real market data APIs
3. **Scale:** Deploy to cloud (AWS, Azure, GCP)
4. **Enhance:** Add mobile app, SMS alerts, payment gateway
5. **Launch:** Release to farmers in your region

---

## 🏆 Support

This platform is ready for:
- ✅ Hackathon demos
- ✅ Pilot deployments
- ✅ Academic projects
- ✅ Social impact initiatives
- ✅ Government programs

---

**Built with ❤️ for India's farmers**

**SPIT Hackathon 2026 - Smart Agricultural Solutions Track**

---

**Version:** 1.0.0  
**Last Updated:** February 14, 2026  
**Status:** Production Ready ✅
