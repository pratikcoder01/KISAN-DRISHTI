# KISAN-DRISHTI Backend Architecture
## Smart Agricultural Market Intelligence Platform - Production-Grade Backend

---

## 🏗️ System Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│  (React/HTML) - Farmers & Officials - Web/Mobile/Voice          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ REST API / WebSocket / SSE
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│   - Rate Limiting  - Authentication  - Request Validation       │
│   - Load Balancing - API Versioning  - CORS Management         │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬─────────────┐
        ▼            ▼            ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Price   │  │   User   │  │  Mandi   │  │ Advisory │
│ Service  │  │ Service  │  │ Service  │  │ Service  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
                   │
     ┌─────────────┼─────────────┬────────────┐
     ▼             ▼             ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│PostgreSQL│  │  Redis   │  │WebSocket │  │  Queue   │
│  Primary │  │  Cache   │  │  Server  │  │  System  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### Technology Stack

**Core Backend**
- Runtime: Node.js 20+ LTS
- Framework: Express.js 4.x (clean, proven, hackathon-friendly)
- Language: TypeScript (type safety, better DX)
- API Style: RESTful + WebSocket for real-time

**Data Layer**
- Primary DB: PostgreSQL 16+ (ACID compliance, reliability)
- Cache: Redis 7+ (price caching, session management)
- ORM: Prisma (type-safe, migrations, developer-friendly)

**Real-Time Communication**
- WebSocket: Socket.io (broad compatibility, fallback support)
- Alternative: Server-Sent Events (SSE) for one-way updates

**Authentication & Security**
- Farmers: Device-based UUID + optional phone verification
- Officials: JWT with role-based access control (RBAC)
- Password: bcrypt hashing
- Rate Limiting: express-rate-limit + Redis

**Infrastructure & DevOps**
- Process Manager: PM2 (production runtime)
- Logging: Winston + Morgan (structured logs)
- Monitoring: Health checks, metrics endpoints
- Deployment: Docker + docker-compose (containerized)

---

## 📁 Project Structure

```
kisan-drishti-backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # DB connection config
│   │   ├── redis.ts              # Redis client setup
│   │   ├── constants.ts          # App-wide constants
│   │   └── env.ts                # Environment validation
│   │
│   ├── controllers/              # Request handlers
│   │   ├── price.controller.ts   # Crop price endpoints
│   │   ├── user.controller.ts    # User/farmer management
│   │   ├── admin.controller.ts   # Official portal
│   │   ├── mandi.controller.ts   # Market locator
│   │   ├── advisory.controller.ts # Intelligence/suggestions
│   │   └── voice.controller.ts   # Voice command processing
│   │
│   ├── services/                 # Business logic layer
│   │   ├── price.service.ts      # Price calculations & trends
│   │   ├── user.service.ts       # User operations
│   │   ├── admin.service.ts      # Admin operations
│   │   ├── mandi.service.ts      # Mandi search & recommendations
│   │   ├── advisory.service.ts   # Profit intelligence
│   │   ├── voice.service.ts      # Intent recognition
│   │   ├── sync.service.ts       # Offline sync management
│   │   └── notification.service.ts # Alerts & broadcasts
│   │
│   ├── repositories/             # Data access layer
│   │   ├── price.repository.ts   # Price CRUD
│   │   ├── user.repository.ts    # User CRUD
│   │   ├── mandi.repository.ts   # Mandi CRUD
│   │   └── audit.repository.ts   # Audit logs
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.middleware.ts    # JWT validation
│   │   ├── role.middleware.ts    # RBAC enforcement
│   │   ├── validation.middleware.ts # Request validation
│   │   ├── error.middleware.ts   # Error handling
│   │   ├── ratelimit.middleware.ts # Rate limiting
│   │   └── locale.middleware.ts  # Language detection
│   │
│   ├── models/                   # Data models (Prisma schema)
│   │   └── schema.prisma         # Database schema
│   │
│   ├── routes/                   # API route definitions
│   │   ├── v1/
│   │   │   ├── index.ts          # Route aggregator
│   │   │   ├── price.routes.ts   # /api/v1/prices
│   │   │   ├── user.routes.ts    # /api/v1/users
│   │   │   ├── admin.routes.ts   # /api/v1/admin
│   │   │   ├── mandi.routes.ts   # /api/v1/mandis
│   │   │   ├── advisory.routes.ts # /api/v1/advisory
│   │   │   └── voice.routes.ts   # /api/v1/voice
│   │
│   ├── websocket/                # Real-time handlers
│   │   ├── socket.server.ts      # Socket.io setup
│   │   ├── price.handler.ts      # Price update broadcasts
│   │   └── admin.handler.ts      # Admin channel
│   │
│   ├── utils/                    # Helper utilities
│   │   ├── logger.ts             # Winston logger
│   │   ├── response.ts           # Standardized responses
│   │   ├── validation.ts         # Zod schemas
│   │   ├── cache.ts              # Redis helpers
│   │   ├── date.ts               # Date/time utilities
│   │   └── language.ts           # i18n helpers
│   │
│   ├── types/                    # TypeScript definitions
│   │   ├── express.d.ts          # Express extensions
│   │   ├── models.ts             # Domain models
│   │   └── api.ts                # API contracts
│   │
│   ├── seeds/                    # Database seeders
│   │   ├── crops.seed.ts         # Initial crop data
│   │   ├── mandis.seed.ts        # Mandi locations
│   │   └── admin.seed.ts         # Default admin user
│   │
│   └── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
│
├── prisma/
│   ├── schema.prisma             # Prisma schema (symlinked)
│   ├── migrations/               # DB migrations
│   └── seed.ts                   # Seeder entry
│
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # API tests
│   └── fixtures/                 # Test data
│
├── docker/
│   ├── Dockerfile                # Backend container
│   ├── docker-compose.yml        # Full stack
│   └── .dockerignore
│
├── docs/
│   ├── API.md                    # API documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── ARCHITECTURE.md           # This file
│
├── scripts/
│   ├── migrate.sh                # Run migrations
│   ├── seed.sh                   # Seed database
│   └── dev.sh                    # Development start
│
├── .env.example                  # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── ecosystem.config.js           # PM2 config
└── README.md
```

---

## 🗄️ Database Schema (PostgreSQL)

### Core Tables

**users** - Farmer/official accounts
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'admin')),
  
  -- Farmer identification (device-based)
  device_id VARCHAR(255) UNIQUE,
  
  -- Admin identification
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  
  -- Profile
  name VARCHAR(255),
  phone VARCHAR(20),
  language VARCHAR(5) DEFAULT 'en',
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  preferred_mandi_id UUID,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_device ON users(device_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**crops** - Master crop catalog
```sql
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,  -- 'wheat', 'onion'
  emoji VARCHAR(10),
  
  -- Multilingual names
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100),
  name_mr VARCHAR(100),
  
  -- Market categorization
  category VARCHAR(50),  -- 'grain', 'vegetable', 'cash_crop'
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_crops_code ON crops(code);
```

**prices** - Current and historical prices
```sql
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES crops(id),
  mandi_id UUID REFERENCES mandis(id),  -- NULL = national average
  
  -- Price data (in INR per quintal)
  price DECIMAL(10, 2) NOT NULL,
  min_price DECIMAL(10, 2),  -- Daily low
  max_price DECIMAL(10, 2),  -- Daily high
  
  -- Market intelligence
  trend_direction VARCHAR(10) CHECK (trend_direction IN ('up', 'down', 'stable')),
  trend_amount DECIMAL(10, 2),  -- Change from previous day
  volatility VARCHAR(10) CHECK (volatility IN ('low', 'medium', 'high')),
  
  -- Advisory
  suggestion VARCHAR(50),  -- 'sell_today', 'wait_2_days', 'hold'
  confidence_score DECIMAL(3, 2),  -- 0.00 to 1.00
  
  -- Timestamp
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP,
  
  -- Audit
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prices_crop_mandi ON prices(crop_id, mandi_id);
CREATE INDEX idx_prices_valid_from ON prices(valid_from DESC);
CREATE INDEX idx_prices_crop_current ON prices(crop_id, valid_from DESC) 
  WHERE valid_until IS NULL;
```

**price_history** - Time-series price data (for trends)
```sql
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES crops(id),
  mandi_id UUID REFERENCES mandis(id),
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_price_history_crop_time ON price_history(crop_id, recorded_at DESC);

-- Hypertable for TimescaleDB (optional optimization)
-- SELECT create_hypertable('price_history', 'recorded_at');
```

**mandis** - Market locations
```sql
CREATE TABLE mandis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Location
  name VARCHAR(255) NOT NULL,
  name_hi VARCHAR(255),
  name_mr VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),
  contact_person VARCHAR(255),
  
  -- Operations
  opening_time TIME,
  closing_time TIME,
  operating_days VARCHAR(50),  -- 'Mon-Sat', 'Daily'
  
  -- Specialization
  specializes_in TEXT[],  -- Array of crop codes
  
  -- Features
  has_cold_storage BOOLEAN DEFAULT false,
  has_quality_testing BOOLEAN DEFAULT false,
  has_online_auction BOOLEAN DEFAULT false,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mandis_location ON mandis USING GIST(
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_mandis_pincode ON mandis(pincode);
```

**audit_logs** - Immutable change tracking
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor
  user_id UUID NOT NULL REFERENCES users(id),
  user_role VARCHAR(20),
  
  -- Action
  action VARCHAR(50) NOT NULL,  -- 'price_update', 'crop_create'
  entity_type VARCHAR(50),       -- 'price', 'crop'
  entity_id UUID,
  
  -- Details
  changes JSONB,  -- Before/after snapshots
  metadata JSONB,  -- IP, user-agent, etc.
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

**user_sessions** - Active sessions
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  device_info JSONB,
  ip_address INET,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expiry ON user_sessions(expires_at);
```

**notifications** - User alerts
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),  -- NULL = broadcast
  
  -- Content
  type VARCHAR(50) NOT NULL,  -- 'price_alert', 'advisory'
  title VARCHAR(255),
  message TEXT,
  title_hi VARCHAR(255),
  message_hi TEXT,
  title_mr VARCHAR(255),
  message_mr TEXT,
  
  -- Related entities
  crop_id UUID REFERENCES crops(id),
  mandi_id UUID REFERENCES mandis(id),
  
  -- State
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) 
  WHERE is_read = false;
```

---

## 🔌 API Design

### Authentication Flow

**Farmer Authentication** (Simplified, accessibility-first)
```
1. Device generates UUID on first launch
2. POST /api/v1/users/register { device_id, name?, phone?, location }
3. Server creates user, returns session token
4. Client stores token, includes in Authorization header
5. Optional: SMS verification for trusted identity badge
```

**Admin Authentication** (Credential-based)
```
1. POST /api/v1/admin/login { email, password }
2. Server validates, returns JWT (expires 24h)
3. Client stores JWT, includes in Authorization header
4. Refresh via POST /api/v1/admin/refresh with refresh token
```

### API Endpoints

#### Prices API

```
GET    /api/v1/prices
Query: ?mandi_id=<uuid>&crop_codes=wheat,rice&language=hi
Response: {
  success: true,
  data: {
    prices: [
      {
        crop: { code: 'wheat', name: 'गेहूँ', emoji: '🌾' },
        price: 2450,
        currency: 'INR',
        unit: 'quintal',
        trend: { direction: 'up', amount: 20, percentage: 0.82 },
        suggestion: { action: 'sell_today', confidence: 0.85 },
        lastUpdated: '2026-02-14T10:30:00Z',
        updatedBy: { name: 'राज कुमार', role: 'admin', verified: true }
      }
    ],
    mandi: { name: 'आज़ादपुर मंडी', city: 'नई दिल्ली' },
    timestamp: '2026-02-14T10:35:00Z'
  }
}

GET    /api/v1/prices/:crop_code/history
Query: ?days=30&mandi_id=<uuid>
Response: Time-series data for charts

GET    /api/v1/prices/:crop_code/trend
Response: Predictive trend analysis

POST   /api/v1/admin/prices (Admin only)
Body: {
  updates: [
    {
      crop_code: 'wheat',
      mandi_id: '<uuid>',
      price: 2450,
      trend: { direction: 'up', amount: 20 },
      suggestion: 'sell_today'
    }
  ]
}
Response: { success: true, updated: 1, broadcastId: '<uuid>' }
→ Triggers WebSocket broadcast to all connected farmers
```

#### Mandi API

```
GET    /api/v1/mandis/nearby
Query: ?lat=28.7041&lng=77.1025&radius=50&crops=wheat,rice
Response: {
  mandis: [
    {
      id: '<uuid>',
      name: 'Krishi Upaj Mandi',
      distance: 3.2,
      isOpen: true,
      specializes: ['wheat', 'rice'],
      contactPerson: 'Ram Singh',
      phone: '+91-XXXXXXXXXX',
      features: {
        hasColdStorage: true,
        hasQualityTesting: true
      }
    }
  ]
}

GET    /api/v1/mandis/:id
GET    /api/v1/mandis/:id/prices
```

#### Advisory API

```
GET    /api/v1/advisory/profit-calculator
Query: ?crop=wheat&quantity=100&current_price=2450&transport_cost=500
Response: {
  revenue: 245000,
  costs: { transport: 500, commission: 7350, other: 1000 },
  netProfit: 236150,
  profitMargin: 96.4,
  recommendation: 'Excellent time to sell. Prices increased 20% this week.'
}

GET    /api/v1/advisory/best-mandi
Query: ?crop=wheat&location=28.7041,77.1025
Response: Recommends mandi with highest price + lowest distance

GET    /api/v1/advisory/sell-timing
Query: ?crop=wheat&quantity=100
Response: AI-driven suggestion on optimal selling day
```

#### Voice API

```
POST   /api/v1/voice/intent
Body: { text: 'आज गेहूं का भाव क्या है', language: 'hi' }
Response: {
  intent: 'get_price',
  entities: { crop: 'wheat' },
  response: {
    text: 'गेहूँ का आज का भाव ₹2,450 प्रति क्विंटल है।',
    audio: '<base64_encoded_mp3>',  // Optional TTS
    data: { crop: 'wheat', price: 2450 }
  }
}

Supported Intents:
- get_price: "What's the price of wheat?"
- get_all_prices: "Tell me today's prices"
- get_best_price: "Which crop has best price?"
- get_mandi: "Where is nearest mandi?"
- get_advice: "Should I sell wheat today?"
```

#### User API

```
POST   /api/v1/users/register (Farmer)
Body: { device_id, name?, phone?, location: {lat, lng}, language }

GET    /api/v1/users/profile
PUT    /api/v1/users/profile
DELETE /api/v1/users/account

GET    /api/v1/users/stats
Response: { searches: 45, calculationsUsed: 12, loginStreak: 7 }
```

#### Admin API

```
POST   /api/v1/admin/login
POST   /api/v1/admin/refresh

GET    /api/v1/admin/analytics
Response: {
  totalFarmers: 15234,
  activeFarmers: 8421,
  priceUpdatesToday: 45,
  topSearchedCrops: ['wheat', 'rice'],
  peakUsageHours: [9, 10, 11, 17, 18]
}

GET    /api/v1/admin/audit-logs
Query: ?entity_type=price&limit=50

POST   /api/v1/admin/broadcast
Body: { title, message, translations, targetCrops?, targetRegion? }
```

#### Sync API (Offline Support)

```
GET    /api/v1/sync/snapshot
Query: ?since=<timestamp>&language=hi
Response: {
  version: 'v1.2345',
  timestamp: '2026-02-14T10:35:00Z',
  prices: [...],
  mandis: [...],
  crops: [...]
}

POST   /api/v1/sync/acknowledge
Body: { version: 'v1.2345', device_id: '<uuid>' }
```

---

## ⚡ Real-Time Architecture (WebSocket)

### Socket.io Implementation

**Connection Flow**
```javascript
// Client connects
const socket = io('wss://api.kisan-drishti.gov.in', {
  auth: { token: '<jwt_or_device_token>' },
  transports: ['websocket', 'polling']  // Fallback support
});

// Server authenticates & joins rooms
socket.on('connection', (socket) => {
  const { userId, role, location, crops } = authenticate(socket);
  
  // Join interest-based rooms
  socket.join(`user:${userId}`);
  socket.join(`role:${role}`);
  if (location.mandiId) socket.join(`mandi:${location.mandiId}`);
  crops.forEach(c => socket.join(`crop:${c}`));
});
```

**Real-Time Events**

```javascript
// Price Update (Admin → All Farmers)
socket.emit('price:update', {
  crop: 'wheat',
  price: 2450,
  trend: { direction: 'up', amount: 20 },
  mandi: { id: '<uuid>', name: 'Azadpur' },
  updatedBy: { name: 'Raj Kumar', verified: true },
  timestamp: '2026-02-14T10:30:00Z'
});

// Broadcast Alert
socket.emit('notification:new', {
  type: 'price_surge',
  title: 'गेहूँ के दाम बढ़े!',
  message: 'गेहूँ का भाव ₹2,450 हो गया (↑20)',
  crop: 'wheat'
});

// Typing indicator (Admin support chat)
socket.emit('support:typing', { adminName: 'Raj' });
```

**Rooms Strategy**
- `role:farmer` - All farmers
- `role:admin` - All officials
- `crop:<code>` - Users interested in specific crop
- `mandi:<id>` - Users near specific mandi
- `user:<id>` - Individual user (private messages)

---

## 🔐 Security Implementation

### Authentication Middleware

```typescript
// middleware/auth.middleware.ts
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }
    
    // JWT for admins
    if (token.startsWith('admin_')) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userService.findById(decoded.userId);
    }
    // Device token for farmers
    else {
      const session = await sessionService.findByToken(token);
      req.user = session.user;
    }
    
    if (!req.user?.is_active) {
      return res.status(403).json({ 
        success: false, 
        error: 'Account inactive' 
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};
```

### Role-Based Access Control

```typescript
// middleware/role.middleware.ts
export const requireRole = (...roles: string[]) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }
    
    next();
  };
};

// Usage
router.post('/admin/prices', 
  authenticate, 
  requireRole('admin'), 
  priceController.update
);
```

### Rate Limiting

```typescript
// middleware/ratelimit.middleware.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: { 
    success: false, 
    error: 'Too many requests, please try again later' 
  }
});

export const adminLimiter = rateLimit({
  store: new RedisStore({ client: redisClient, prefix: 'rl:admin:' }),
  windowMs: 15 * 60 * 1000,
  max: 500  // Higher limit for admins
});
```

### Input Validation

```typescript
// utils/validation.ts
import { z } from 'zod';

export const priceUpdateSchema = z.object({
  updates: z.array(z.object({
    crop_code: z.string().min(2).max(50),
    mandi_id: z.string().uuid().optional(),
    price: z.number().positive().max(999999),
    trend: z.object({
      direction: z.enum(['up', 'down', 'stable']),
      amount: z.number()
    }).optional(),
    suggestion: z.enum([
      'sell_today', 'wait_2_days', 'wait_3_days', 'hold'
    ]).optional()
  })).min(1).max(100)
});

// middleware/validation.middleware.ts
export const validate = (schema: z.ZodSchema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }
      next(error);
    }
  };
};
```

---

## 📊 Caching Strategy (Redis)

### Cache Structure

```typescript
// Price cache (5-minute TTL, high read frequency)
CACHE:price:wheat:mandi:uuid        → JSON price object
CACHE:price:wheat:national          → National average
CACHE:prices:all:mandi:uuid         → All prices for mandi

// User session (24-hour TTL)
SESSION:token:abc123                → User ID + metadata

// API response cache (1-minute TTL for volatile data)
CACHE:api:nearby-mandis:28.7,77.1   → Mandi list

// Real-time sync version
SYNC:version                        → Current data version
SYNC:snapshot:v1.2345               → Full data snapshot

// Rate limiting
RL:api:192.168.1.1                  → Request count
```

### Cache Invalidation

```typescript
// services/cache.service.ts
export class CacheService {
  async invalidatePriceCache(cropCode: string, mandiId?: string) {
    const pattern = mandiId 
      ? `CACHE:price:${cropCode}:mandi:${mandiId}*`
      : `CACHE:price:${cropCode}:*`;
    
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
    
    // Invalidate aggregate caches
    await redis.del(`CACHE:prices:all:mandi:${mandiId}`);
    await redis.del(`CACHE:prices:all:national`);
  }
  
  async incrementSyncVersion() {
    const version = await redis.incr('SYNC:version');
    return `v${version}`;
  }
}
```

---

## 🌐 Internationalization (i18n)

### Language Support

```typescript
// utils/language.ts
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

export const getLocalizedField = (
  obj: any, 
  field: string, 
  language: Language
): string => {
  const localized = obj[`${field}_${language}`];
  return localized || obj[`${field}_en`] || obj[field] || '';
};

// middleware/locale.middleware.ts
export const detectLanguage = (req, res, next) => {
  const lang = req.query.language || 
               req.headers['accept-language']?.split(',')[0]?.split('-')[0] ||
               'en';
  
  req.language = SUPPORTED_LANGUAGES.includes(lang as any) 
    ? lang as Language 
    : 'en';
  
  next();
};

// Usage in controller
const prices = await priceService.getCurrentPrices(mandiId);
const localized = prices.map(p => ({
  ...p,
  crop: {
    code: p.crop.code,
    name: getLocalizedField(p.crop, 'name', req.language),
    emoji: p.crop.emoji
  }
}));
```

### Translation Service (for voice responses)

```typescript
// services/translation.service.ts
export class TranslationService {
  private translations: Record<Language, Record<string, string>>;
  
  async loadTranslations() {
    // Load from file or database
    this.translations = {
      en: { 'price.response': 'The price of {crop} is ₹{price}' },
      hi: { 'price.response': '{crop} का भाव ₹{price} है' },
      mr: { 'price.response': '{crop} ची किंमत ₹{price} आहे' }
    };
  }
  
  translate(key: string, params: Record<string, any>, lang: Language) {
    let text = this.translations[lang]?.[key] || 
               this.translations.en[key] || 
               key;
    
    // Replace placeholders
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
    
    return text;
  }
}
```

---

## 🎤 Voice Intelligence (Intent Recognition)

### Rule-Based Intent Matching

```typescript
// services/voice.service.ts
export class VoiceService {
  async processIntent(text: string, language: Language) {
    const normalized = text.toLowerCase().trim();
    
    // Price query patterns
    if (this.matchesPattern(normalized, [
      /(?:price|भाव|किंमत).*(?:wheat|गेहूँ|गहू)/,
      /wheat.*(?:price|भाव|किंमत)/
    ])) {
      return this.handlePriceQuery('wheat', language);
    }
    
    // All prices
    if (this.matchesPattern(normalized, [
      /(?:all|सभी|सर्व).*(?:prices|भाव|किंमत)/,
      /(?:today|आज).*(?:prices|भाव|किंमत)/
    ])) {
      return this.handleAllPricesQuery(language);
    }
    
    // Best price
    if (this.matchesPattern(normalized, [
      /(?:best|highest|सबसे|सर्वोत्तम).*price/,
      /(?:which|कौन|कोणता).*(?:crop|फसल)/
    ])) {
      return this.handleBestPriceQuery(language);
    }
    
    // Mandi location
    if (this.matchesPattern(normalized, [
      /(?:where|कहाँ|कुठे).*(?:mandi|market|मंडी|बाजार)/,
      /(?:nearest|नजदीक|जवळ).*mandi/
    ])) {
      return this.handleMandiQuery(language);
    }
    
    // Selling advice
    if (this.matchesPattern(normalized, [
      /(?:should|क्या).*sell/,
      /(?:when|कब|केव्हा).*sell/
    ])) {
      return this.handleSellAdviceQuery(language);
    }
    
    return this.handleUnknownIntent(language);
  }
  
  private async handlePriceQuery(crop: string, language: Language) {
    const price = await priceService.getCurrentPrice(crop);
    const response = translationService.translate(
      'price.response',
      { crop: price.crop.name, price: price.price },
      language
    );
    
    return {
      intent: 'get_price',
      entities: { crop },
      response: { text: response, data: price }
    };
  }
}
```

### Advanced: ML-Based Intent (Optional)

```typescript
// For production enhancement (beyond hackathon scope)
import { pipeline } from '@xenova/transformers';

export class MLVoiceService {
  private classifier: any;
  
  async initialize() {
    this.classifier = await pipeline(
      'text-classification',
      'distilbert-base-uncased-finetuned-sst-2-english'
    );
  }
  
  async classifyIntent(text: string) {
    const result = await this.classifier(text);
    return result[0].label;
  }
}
```

---

## 🔄 Offline Sync Architecture

### Sync Version Management

```typescript
// services/sync.service.ts
export class SyncService {
  async generateSnapshot(language: Language = 'en') {
    const version = await cacheService.incrementSyncVersion();
    
    const snapshot = {
      version,
      timestamp: new Date().toISOString(),
      prices: await this.getCompactPrices(language),
      mandis: await this.getCompactMandis(language),
      crops: await this.getCompactCrops(language)
    };
    
    // Cache snapshot for 1 hour
    await redis.setex(
      `SYNC:snapshot:${version}`,
      3600,
      JSON.stringify(snapshot)
    );
    
    return snapshot;
  }
  
  async getSnapshotSince(since: string, language: Language) {
    const currentVersion = await redis.get('SYNC:version');
    
    if (since === `v${currentVersion}`) {
      return { upToDate: true, version: since };
    }
    
    // Return full snapshot if version mismatch or too old
    return this.generateSnapshot(language);
  }
  
  private async getCompactPrices(language: Language) {
    const prices = await priceService.getCurrentPrices();
    
    return prices.map(p => ({
      c: p.crop.code,  // Compact keys to save bandwidth
      n: getLocalizedField(p.crop, 'name', language),
      p: p.price,
      t: p.trend.direction[0],  // 'u'/'d'/'s'
      ta: p.trend.amount,
      s: p.suggestion,
      u: p.updated_at
    }));
  }
}
```

### Client-Side Sync Logic (Frontend Reference)

```javascript
// Frontend sync implementation
class OfflineSync {
  async sync() {
    try {
      const lastVersion = localStorage.getItem('sync_version');
      const language = localStorage.getItem('language') || 'en';
      
      const response = await fetch(
        `/api/v1/sync/snapshot?since=${lastVersion}&language=${language}`
      );
      const data = await response.json();
      
      if (data.upToDate) {
        console.log('Data is up to date');
        return;
      }
      
      // Store snapshot locally
      localStorage.setItem('sync_version', data.version);
      localStorage.setItem('sync_data', JSON.stringify(data));
      localStorage.setItem('sync_timestamp', Date.now());
      
      // Update UI
      window.dispatchEvent(new CustomEvent('data-synced'));
      
    } catch (error) {
      console.log('Offline mode - using cached data');
    }
  }
  
  getCachedData() {
    const cached = localStorage.getItem('sync_data');
    return cached ? JSON.parse(cached) : null;
  }
}
```

---

## 📈 Admin Analytics & Insights

### Analytics Service

```typescript
// services/analytics.service.ts
export class AnalyticsService {
  async getDashboardMetrics() {
    return {
      farmers: {
        total: await userRepository.countByRole('farmer'),
        active: await this.getActiveFarmers(7),  // Last 7 days
        new: await this.getNewFarmers(30)
      },
      prices: {
        updatesToday: await this.getPriceUpdatesToday(),
        totalCrops: await cropRepository.count(),
        volatileCrops: await this.getVolatileCrops(7)
      },
      usage: {
        searchesToday: await this.getSearchCount(1),
        voiceQueriesToday: await this.getVoiceQueryCount(1),
        peakHours: await this.getPeakUsageHours(7)
      },
      geography: {
        topStates: await this.getTopStatesByUsers(),
        activeMandis: await this.getActiveMandis()
      }
    };
  }
  
  async getCropTrends(cropCode: string, days: number) {
    const history = await priceRepository.getHistory(cropCode, days);
    
    return {
      cropCode,
      period: `${days} days`,
      data: history.map(h => ({
        date: h.recorded_at,
        price: h.price
      })),
      stats: {
        avg: this.calculateAverage(history),
        min: Math.min(...history.map(h => h.price)),
        max: Math.max(...history.map(h => h.price)),
        volatility: this.calculateVolatility(history)
      }
    };
  }
}
```

---

## 🚀 Deployment Architecture

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: kisan_drishti
      POSTGRES_USER: kisan_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kisan_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Backend API
  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://kisan_user:${DB_PASSWORD}@postgres:5432/kisan_drishti
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

### Dockerfile

```dockerfile
# docker/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

EXPOSE 3000
```

### PM2 Ecosystem Config

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'kisan-drishti-api',
    script: 'dist/server.js',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

---

## 🔍 Monitoring & Logging

### Health Check Endpoint

```typescript
// routes/health.routes.ts
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      websocket: 'unknown'
    }
  };
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'healthy';
  } catch (e) {
    health.services.database = 'unhealthy';
    health.status = 'degraded';
  }
  
  try {
    await redis.ping();
    health.services.redis = 'healthy';
  } catch (e) {
    health.services.redis = 'unhealthy';
    health.status = 'degraded';
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Structured Logging

```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'kisan-drishti-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;

// Usage
logger.info('Price updated', { 
  cropCode: 'wheat', 
  price: 2450, 
  adminId: 'uuid' 
});
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// tests/unit/price.service.test.ts
import { PriceService } from '../../src/services/price.service';

describe('PriceService', () => {
  let priceService: PriceService;
  
  beforeEach(() => {
    priceService = new PriceService();
  });
  
  describe('calculateTrend', () => {
    it('should detect upward trend', () => {
      const current = 2450;
      const previous = 2430;
      
      const trend = priceService.calculateTrend(current, previous);
      
      expect(trend.direction).toBe('up');
      expect(trend.amount).toBe(20);
      expect(trend.percentage).toBeCloseTo(0.82);
    });
  });
  
  describe('generateSuggestion', () => {
    it('should suggest selling on strong upward trend', () => {
      const trend = { direction: 'up', amount: 50, percentage: 2.1 };
      
      const suggestion = priceService.generateSuggestion(trend, 'low');
      
      expect(suggestion).toBe('sell_today');
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/price.api.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Price API', () => {
  describe('GET /api/v1/prices', () => {
    it('should return current prices', async () => {
      const response = await request(app)
        .get('/api/v1/prices')
        .query({ language: 'en' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.prices).toBeInstanceOf(Array);
      expect(response.body.data.prices[0]).toHaveProperty('crop');
      expect(response.body.data.prices[0]).toHaveProperty('price');
    });
  });
  
  describe('POST /api/v1/admin/prices', () => {
    it('should update prices with admin auth', async () => {
      const adminToken = await getAdminToken();
      
      const response = await request(app)
        .post('/api/v1/admin/prices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          updates: [{
            crop_code: 'wheat',
            price: 2450,
            trend: { direction: 'up', amount: 20 }
          }]
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.updated).toBe(1);
    });
    
    it('should reject without admin auth', async () => {
      await request(app)
        .post('/api/v1/admin/prices')
        .send({
          updates: [{ crop_code: 'wheat', price: 2450 }]
        })
        .expect(401);
    });
  });
});
```

---

## 📋 Environment Variables

```bash
# .env.example

# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://kisan_user:password@localhost:5432/kisan_drishti
DB_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS
ALLOWED_ORIGINS=http://localhost:8080,https://kisan-drishti.gov.in

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs/

# External Services (Optional)
SMS_PROVIDER_API_KEY=
WEATHER_API_KEY=
MAPS_API_KEY=

# Features
ENABLE_WEBSOCKET=true
ENABLE_VOICE=true
ENABLE_SMS_VERIFICATION=false

# Monitoring
SENTRY_DSN=
ANALYTICS_ENABLED=false
```

---

## 🎯 Key Features Summary

### ✅ Implemented Features

1. **Real-Time Price Synchronization**
   - WebSocket broadcasts on admin updates
   - Redis caching for instant reads
   - Optimistic UI updates

2. **Role-Based Access Control**
   - Simplified farmer authentication (device-based)
   - Secure admin portal (JWT)
   - Granular permissions

3. **Offline-First Architecture**
   - Versioned data snapshots
   - Differential sync
   - Local-first reads

4. **Multilingual Support**
   - Database-level translations
   - Runtime language switching
   - Voice response localization

5. **Voice Intelligence**
   - Rule-based intent recognition
   - Multi-language support (en/hi/mr)
   - Contextual responses

6. **Audit & Transparency**
   - Immutable audit logs
   - Admin identity verification
   - Price update history

7. **Smart Advisory**
   - Trend-based suggestions
   - Profit calculator
   - Optimal mandi recommendations

8. **Production-Ready Infrastructure**
   - Docker containerization
   - Health checks
   - Structured logging
   - Graceful shutdown

---

## 🚦 Getting Started (Quick Start)

```bash
# 1. Clone repository
git clone <repo-url>
cd kisan-drishti-backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 4. Start databases (Docker)
docker-compose up -d postgres redis

# 5. Run migrations
npx prisma migrate dev

# 6. Seed database
npm run seed

# 7. Start development server
npm run dev

# API available at http://localhost:3000
# WebSocket at ws://localhost:3000
```

---

## 📚 Next Steps & Enhancements

### For Production Deployment

1. **Security Hardening**
   - Helmet.js for HTTP headers
   - HTTPS enforcement
   - SQL injection prevention (Prisma handles this)
   - CSRF protection

2. **Scalability**
   - Load balancer (Nginx/HAProxy)
   - Database read replicas
   - Redis cluster
   - CDN for static assets

3. **Observability**
   - APM (New Relic/Datadog)
   - Distributed tracing
   - Error tracking (Sentry)
   - Custom metrics

4. **Advanced Features**
   - ML-based price prediction
   - Weather integration
   - Market news aggregation
   - Mobile push notifications

---

**Document Version:** 1.0  
**Last Updated:** February 14, 2026  
**Maintained By:** Backend Development Team
