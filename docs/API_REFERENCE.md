# KISAN-DRISHTI API Reference

Complete API documentation for the Smart Agricultural Market Intelligence Platform backend.

**Base URL:** `http://localhost:3000/api/v1`  
**Production URL:** `https://api.kisan-drishti.gov.in/api/v1`

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

**Token Types:**
- **Farmer Token:** UUID-based device token (returned from registration)
- **Admin Token:** JWT token (returned from login)

---

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "timestamp": "2026-02-14T10:30:00Z",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2026-02-14T10:30:00Z"
}
```

---

## Endpoints

### 🌾 Prices

#### Get Current Prices
```http
GET /prices
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| language | string | No | Language code: 'en', 'hi', 'mr' (default: 'en') |
| mandi_id | uuid | No | Filter by specific mandi |
| crop_codes | string | No | Comma-separated crop codes (e.g., 'wheat,rice') |

**Response:**
```json
{
  "success": true,
  "data": {
    "prices": [
      {
        "crop": {
          "code": "wheat",
          "name": "गेहूँ",
          "emoji": "🌾"
        },
        "price": 2450,
        "currency": "INR",
        "unit": "quintal",
        "trend": {
          "direction": "up",
          "amount": 20,
          "percentage": 0.82
        },
        "volatility": "medium",
        "suggestion": {
          "action": "sell_today",
          "confidence": 0.85
        },
        "lastUpdated": "2026-02-14T10:30:00Z",
        "updatedBy": {
          "name": "राज कुमार",
          "role": "admin",
          "verified": true
        }
      }
    ],
    "mandi": {
      "id": "uuid",
      "name": "आज़ादपुर मंडी",
      "city": "नई दिल्ली"
    },
    "timestamp": "2026-02-14T10:35:00Z"
  }
}
```

---

#### Get Price History
```http
GET /prices/{crop_code}/history
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| crop_code | string | Crop identifier (e.g., 'wheat') |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| days | integer | No | 30 | Number of days of history |
| mandi_id | uuid | No | null | Specific mandi (null = national) |

**Response:**
```json
{
  "success": true,
  "data": {
    "crop": {
      "code": "wheat",
      "name": "Wheat"
    },
    "period": "30 days",
    "history": [
      {
        "date": "2026-02-14",
        "price": 2450,
        "min": 2400,
        "max": 2480
      }
    ],
    "statistics": {
      "average": 2420,
      "min": 2350,
      "max": 2480,
      "volatility": "medium"
    }
  }
}
```

---

#### Update Prices (Admin Only)
```http
POST /admin/prices
```

**Authorization:** Admin token required

**Request Body:**
```json
{
  "updates": [
    {
      "crop_code": "wheat",
      "mandi_id": "uuid-optional",
      "price": 2450,
      "trend": {
        "direction": "up",
        "amount": 20
      },
      "suggestion": "sell_today",
      "confidence_score": 0.85
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": 1,
    "broadcastId": "uuid",
    "timestamp": "2026-02-14T10:30:00Z"
  },
  "message": "Prices updated and broadcast to farmers"
}
```

**WebSocket Broadcast:**
All connected farmers will receive a real-time `price:update` event.

---

### 👤 User Management

#### Register Farmer
```http
POST /users/register
```

**Request Body:**
```json
{
  "device_id": "unique-device-uuid",
  "name": "Ramesh Kumar",
  "phone": "+91-9876543210",
  "language": "hi",
  "location": {
    "lat": 28.7041,
    "lng": 77.1025
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Ramesh Kumar",
      "role": "farmer",
      "language": "hi"
    },
    "token": "session-token-uuid",
    "expiresAt": "2026-03-16T10:30:00Z"
  }
}
```

---

#### Get User Profile
```http
GET /users/profile
```

**Authorization:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ramesh Kumar",
    "phone": "+91-9876543210",
    "language": "hi",
    "location": {
      "lat": 28.7041,
      "lng": 77.1025
    },
    "preferredMandi": {
      "id": "uuid",
      "name": "Krishi Upaj Mandi"
    },
    "stats": {
      "searches": 45,
      "calculationsUsed": 12,
      "loginStreak": 7
    },
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

---

### 🏪 Mandi (Market) Locator

#### Find Nearby Mandis
```http
GET /mandis/nearby
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | float | Yes | Latitude |
| lng | float | Yes | Longitude |
| radius | integer | No | Search radius in km (default: 50) |
| crops | string | No | Filter by crops (comma-separated) |
| language | string | No | Response language |

**Response:**
```json
{
  "success": true,
  "data": {
    "mandis": [
      {
        "id": "uuid",
        "name": "Krishi Upaj Mandi",
        "address": "Near Railway Station, Sector 42",
        "city": "Gurgaon",
        "state": "Haryana",
        "distance": 3.2,
        "isOpen": true,
        "openingTime": "06:00",
        "closingTime": "20:00",
        "specializes": ["wheat", "rice", "cotton"],
        "contactPerson": "Ram Singh",
        "phone": "+91-9876543210",
        "features": {
          "hasColdStorage": true,
          "hasQualityTesting": true,
          "hasOnlineAuction": false
        }
      }
    ],
    "currentLocation": {
      "lat": 28.7041,
      "lng": 77.1025
    }
  }
}
```

---

#### Get Mandi Details
```http
GET /mandis/{mandi_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Azadpur Mandi",
    "address": "Azadpur, New Delhi",
    "coordinates": {
      "lat": 28.7041,
      "lng": 77.1025
    },
    "contact": {
      "phone": "+91-11-27675555",
      "email": "info@azadpurmandi.gov.in",
      "contactPerson": "Rajesh Sharma"
    },
    "operations": {
      "openingTime": "06:00",
      "closingTime": "20:00",
      "operatingDays": "Mon-Sat"
    },
    "specialization": ["vegetables", "fruits"],
    "features": {
      "coldStorage": true,
      "qualityTesting": true,
      "onlineAuction": true
    },
    "currentPrices": [
      {
        "crop": "Tomato",
        "price": 2400
      }
    ]
  }
}
```

---

### 🧮 Advisory & Intelligence

#### Profit Calculator
```http
GET /advisory/profit-calculator
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| crop | string | Yes | Crop code |
| quantity | float | Yes | Quantity in quintals |
| current_price | float | No | Override price (uses latest if not provided) |
| transport_cost | float | No | Transport cost (default: 0) |
| mandi_id | uuid | No | Target mandi |

**Response:**
```json
{
  "success": true,
  "data": {
    "crop": "wheat",
    "quantity": 100,
    "price": 2450,
    "revenue": 245000,
    "costs": {
      "transport": 500,
      "commission": 7350,
      "other": 1000,
      "total": 8850
    },
    "netProfit": 236150,
    "profitMargin": 96.4,
    "recommendation": "Excellent time to sell. Prices increased 20% this week.",
    "alternativeMandis": [
      {
        "name": "Nearby Mandi",
        "price": 2480,
        "distance": 5.2,
        "estimatedProfit": 237800
      }
    ]
  }
}
```

---

#### Best Mandi Recommendation
```http
GET /advisory/best-mandi
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| crop | string | Yes | Crop code |
| location | string | Yes | "lat,lng" format |
| quantity | float | No | For profit calculation |

**Response:**
```json
{
  "success": true,
  "data": {
    "recommended": {
      "mandi": {
        "id": "uuid",
        "name": "Azadpur Mandi",
        "distance": 12.5
      },
      "price": 2480,
      "reason": "Highest price within 50km radius",
      "estimatedProfit": 245000,
      "transportCost": 750
    },
    "alternatives": [
      {
        "mandi": {
          "name": "Ghazipur Mandi",
          "distance": 18.2
        },
        "price": 2460,
        "estimatedProfit": 243500
      }
    ]
  }
}
```

---

### 🎤 Voice Commands

#### Process Voice Intent
```http
POST /voice/intent
```

**Request Body:**
```json
{
  "text": "आज गेहूं का भाव क्या है",
  "language": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "intent": "get_price",
    "entities": {
      "crop": "wheat"
    },
    "response": {
      "text": "गेहूँ का आज का भाव ₹2,450 प्रति क्विंटल है। कल से ₹20 बढ़ा है।",
      "data": {
        "crop": "wheat",
        "price": 2450,
        "trend": {
          "direction": "up",
          "amount": 20
        }
      }
    },
    "suggestions": [
      "कल के भाव देखें",
      "बेचने की सलाह लें",
      "नजदीकी मंडी खोजें"
    ]
  }
}
```

**Supported Intents:**
- `get_price` - Get price of a crop
- `get_all_prices` - Get all current prices
- `get_best_price` - Which crop has best price
- `get_mandi` - Find nearby mandi
- `get_advice` - Should I sell today
- `get_trend` - Price trend analysis

---

### 🔄 Offline Sync

#### Get Data Snapshot
```http
GET /sync/snapshot
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| since | string | No | Version ID (e.g., 'v1234') |
| language | string | No | Language for localized data |

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "v1245",
    "timestamp": "2026-02-14T10:35:00Z",
    "prices": [
      {
        "c": "wheat",
        "n": "गेहूँ",
        "p": 2450,
        "t": "u",
        "ta": 20,
        "s": "sell_today",
        "u": "2026-02-14T10:30:00Z"
      }
    ],
    "mandis": [
      {
        "i": "uuid",
        "n": "आज़ादपुर मंडी",
        "lat": 28.7041,
        "lng": 77.1025,
        "c": "Delhi"
      }
    ],
    "crops": [
      {
        "c": "wheat",
        "n": "गेहूँ",
        "e": "🌾"
      }
    ]
  }
}
```

---

### 🔑 Admin Authentication

#### Admin Login
```http
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@kisan-drishti.gov.in",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@kisan-drishti.gov.in",
      "name": "Raj Kumar",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-uuid",
    "expiresAt": "2026-02-15T10:30:00Z"
  }
}
```

---

#### Admin Analytics
```http
GET /admin/analytics
```

**Authorization:** Admin token required

**Response:**
```json
{
  "success": true,
  "data": {
    "farmers": {
      "total": 15234,
      "active": 8421,
      "newThisMonth": 543
    },
    "prices": {
      "updatesToday": 45,
      "totalCrops": 50,
      "volatileCrops": ["onion", "tomato"]
    },
    "usage": {
      "searchesToday": 12453,
      "voiceQueriesToday": 3421,
      "peakHours": [9, 10, 11, 17, 18]
    },
    "geography": {
      "topStates": [
        {"state": "Maharashtra", "users": 3421},
        {"state": "Punjab", "users": 2876}
      ],
      "activeMandis": 245
    }
  }
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('ws://localhost:3000', {
  auth: { token: 'your-token' }
});
```

### Events

#### price:update
Broadcast when admin updates prices.

```javascript
socket.on('price:update', (data) => {
  // data = {
  //   crop: 'wheat',
  //   price: 2450,
  //   trend: { direction: 'up', amount: 20 },
  //   mandi: { id: 'uuid', name: 'Azadpur' },
  //   updatedBy: { name: 'Admin', verified: true }
  // }
});
```

#### notification:new
New system notifications.

```javascript
socket.on('notification:new', (data) => {
  // data = {
  //   type: 'price_surge',
  //   title: 'Price Alert',
  //   message: 'Wheat price increased by ₹20',
  //   crop: 'wheat'
  // }
});
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - System degraded |

---

## Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public APIs | 100 requests | 15 minutes |
| Admin APIs | 500 requests | 15 minutes |
| Auth endpoints | 10 requests | 1 minute |

---

**Documentation Version:** 1.0  
**Last Updated:** February 14, 2026  
**API Version:** v1
