# NAVA/MIYA Platform - Deployment Guide

Complete guide for deploying and running the NAVA/MIYA water delivery platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running Both Services](#running-both-services)
6. [Database Setup](#database-setup)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **MongoDB**: v4.4.0 or higher (local or cloud)
- **Git**: For version control

### Verification

```bash
node --version    # Should output v14.0.0 or higher
npm --version     # Should output v6.0.0 or higher
mongo --version   # Should output MongoDB v4.4.0 or higher (if local)
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/M112244/Serene-2.git
cd Serene-2
```

### 2. Install Root Dependencies

```bash
npm install
```

This installs backend dependencies in the root directory.

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

## Backend Setup

### 1. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nava_miya

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

# Server
PORT=5000
NODE_ENV=development

# Email/SMS (Optional for development)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=+1234567890

# SMTP (Optional for development)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway (Optional for development)
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLIC_KEY=pk_test_xxxx

# AWS (Optional for S3 storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1

# Maps
MAPS_API_KEY=your_google_maps_api_key
```

### 2. Start MongoDB

#### Local MongoDB:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux with systemd
sudo systemctl start mongod

# Windows
mongod
```

#### Cloud MongoDB (MongoDB Atlas):
Update `MONGODB_URI` to your connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/nava_miya
```

### 3. Start Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

**Health Check**:
```bash
curl http://localhost:5000/health
# Response: {"status":"Server is running"}
```

## Frontend Setup

### 1. Start Development Server

```bash
cd frontend
npm start
```

The frontend will automatically open at `http://localhost:3000`

### 2. Build for Production

```bash
npm run build
```

Output files will be in `frontend/build/`

## Running Both Services

### Option 1: Separate Terminals

**Terminal 1 (Backend)**:
```bash
npm start
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm start
```

### Option 2: Concurrently (Install concurrently first)

```bash
npm install -g concurrently
concurrently "npm start" "cd frontend && npm start"
```

## Database Setup

### Initial Data

The application automatically creates collections when first accessed. To populate with sample data:

```javascript
// backend/scripts/seed.js (create this file)
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI);

const sampleUsers = [
  {
    firstName: 'Ahmed',
    lastName: 'Al-Dosari',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    password: 'password123',
    userType: 'homeowner'
  }
  // Add more sample data
];

User.insertMany(sampleUsers).then(() => {
  console.log('Sample data inserted');
  mongoose.connection.close();
});
```

Run with:
```bash
node backend/scripts/seed.js
```

### Database Backup

```bash
# Local MongoDB
mongodump --uri="mongodb://localhost:27017/nava_miya" --out=backup/

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/nava_miya" backup/
```

## Production Deployment

### 1. Environment Variables

Update `.env` for production:
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret_key
PORT=80
```

### 2. Deploy Backend (Heroku Example)

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### 3. Deploy Frontend (Vercel Example)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set up environment variables in Vercel dashboard
```

### 4. Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY backend ./backend
COPY frontend ./frontend

RUN cd frontend && npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t nava-miya .
docker run -p 5000:5000 -e MONGODB_URI=your_uri nava-miya
```

## API Testing

### Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Dosari",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "password": "password123",
    "userType": "homeowner"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "password123"
  }'

# Get tanks (with JWT token)
curl -X GET http://localhost:5000/api/tanks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API collection from `postman_collection.json`
2. Set up environment variables (base_url, token)
3. Test each endpoint

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoError: connect ECONNREFUSED`

**Solution**:
```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB
mongod

# Or use cloud: Update MONGODB_URI in .env
```

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm start
```

### Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Reinstall dependencies
npm install

# For frontend
cd frontend
npm install
```

### Frontend API Connection Error

**Error**: `404 Not Found` when calling API

**Solution**:
1. Ensure backend is running on port 5000
2. Check `frontend/src/services/api.js` proxy setting
3. Update CORS in `backend/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

## Performance Optimization

### Backend Optimizations
- Enable MongoDB indexing
- Implement caching (Redis)
- Use pagination for large datasets
- Enable GZIP compression

### Frontend Optimizations
- Run production build: `npm run build`
- Enable lazy loading
- Optimize images
- Minify CSS/JS (done by create-react-app)

## Security Checklist

- [ ] Set strong JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting
- [ ] Implement authentication on all protected routes
- [ ] Use HTTPS for database connections
- [ ] Regular backups of production data
- [ ] Monitor error logs

## Monitoring

### Logging

```bash
# Backend logs
tail -f logs/app.log

# Monitor API performance
pm2 logs app
```

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Frontend - check browser console for errors
```

## Support

For issues or questions:
1. Check this guide
2. Review error logs
3. Check GitHub issues
4. Contact support@navamiya.com

---

**Last Updated**: November 2024
**Version**: 1.0.0
