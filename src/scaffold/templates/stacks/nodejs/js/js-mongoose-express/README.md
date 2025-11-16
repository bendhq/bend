![Bend-App](https://raw.githubusercontent.com/DevBend/bendjs/master/docs/bend-app.png)


# Bend-App Express APP

A production-ready Express + Mongoose backend built with ES Modules, security middleware, Winston logging with rotation, Joi-based environment validation, dynamic CORS from .env, rate limiting, Prometheus metrics, and graceful shutdown handling.


---

## Features

- Express server (ESM)
- Helmet security headers
- HPP (HTTP Parameter Pollution protection)
- Compression middleware
- Dynamic CORS loaded from environment variables
- Rate limiting with express-rate-limit
- Mongoose integration with graceful shutdown
- Winston logging with rotating logs
- Request ID middleware
- Central request logging middleware
- Centralized error handler
- Prometheus metrics at /metrics
- Health route at /health
- Root metadata route at /

---

## Folder Structure

```
src/
  server.js
  app.js

  config/
    index.js
    db.js

  middlewares/
    requestLogger.js
    errorHandler.js
    validateBody.js

  utils/
    logger.js
    requestId.js

  routes/
    user.route.js

  controllers/
    user.controller.js

  services/
    user.service.js

  models/
    user.model.js

  schemas/
    user.schema.js

logs/
```

---

## Requirements

- Node.js 20+
- MongoDB 5+
- npm 9+

---

## Installation

1. Install dependencies

```
npm install
```

2. Create a .env file

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/myapp
APP_NAME=Bend-App
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
CORS_ORIGIN=*
```

3. Start development server

```
npm run dev
```

4. Start in production

```
npm start
```

---

## API Endpoints

Health:
```
GET /health
```

Root app metadata:
```
GET /
```

Prometheus metrics:
```
GET /metrics
```

Users:
```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
```

---

## Environment Variables

```
PORT
NODE_ENV
MONGO_URI
APP_NAME
TRUST_PROXY
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX
LOG_LEVEL
CORS_ORIGIN
```

All validated at startup using Joi. Missing or invalid values cause startup failure.

---

## Logging

Winston logger with:

- Console logs
- Rotating daily log files
- Rotating error logs
- Request logs (IP, method, route, status, duration, requestId)
- Stack traces for server errors

Logs stored in:

```
logs/
  application-YYYY-MM-DD.log
  errors-YYYY-MM-DD.log
```

---

## Graceful Shutdown

Handles:

- SIGINT
- SIGTERM
- uncaughtException
- unhandledRejection

Steps:

- Stops accepting new HTTP connections
- Closes Express server
- Disconnects Mongoose
- Exits cleanly

---

## CORS

CORS_ORIGIN supports:

```
*
https://domain.com
https://domain1.com,https://domain2.com
```

If set to "*", all origins are allowed (development mode).

---

## Metrics

Prometheus metrics available at:

```
GET /metrics
```

---

## License

MIT