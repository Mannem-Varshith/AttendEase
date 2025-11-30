# Complete Deployment Guide - AttendEase

This comprehensive guide covers deploying your Employee Attendance System to production using free hosting platforms.

## 📋 Table of Contents
1. [MongoDB Atlas Setup](#1-mongodb-atlas-setup)
2. [Backend Deployment (Render)](#2-backend-deployment-render)
3. [Frontend Deployment (Vercel)](#3-frontend-deployment-vercel)
4. [Alternative: Railway (Full Stack)](#4-alternative-railway-full-stack)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Post-Deployment Steps](#6-post-deployment-steps)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. MongoDB Atlas Setup

### Step 1.1: Create Account
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier includes 512MB storage)
3. Verify your email

### Step 1.2: Create Free Cluster
1. Click **"Build a Database"**
2. Select **"M0 FREE"** tier
3. Choose **Cloud Provider**: AWS/Google Cloud/Azure
4. Select **Region**: Choose closest to your target users
   - India: Mumbai (ap-south-1)
   - USA: N. Virginia (us-east-1)
   - Europe: Ireland (eu-west-1)
5. Cluster Name: `AttendEase` (or any name)
6. Click **"Create Cluster"** (takes 1-3 minutes)

### Step 1.3: Create Database User
1. Navigate to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `admin` (or your choice)
5. **Password**: Generate a strong password
   - ⚠️ **SAVE THIS PASSWORD** - you'll need it!
6. **Database User Privileges**: "Read and write to any database"
7. Click **"Add User"**

### Step 1.4: Whitelist IP Addresses
1. Navigate to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. **For Testing**: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This allows connections from any IP
   - ⚠️ For production, specify exact IPs for better security
4. Click **"Confirm"**

### Step 1.5: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://admin:<password>@attendease.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Modify it**:
   - Replace `<password>` with your actual password
   - Add database name before `?`: `/employee-attendance?`
   
   **Final format**:
   ```
   mongodb+srv://admin:YourPassword123@attendease.xxxxx.mongodb.net/employee-attendance?retryWrites=true&w=majority
   ```

7. ⚠️ **Save this connection string** for deployment!

---

## 2. Backend Deployment (Render)

Render offers free tier with auto-sleep (wakes up on request).

### Step 2.1: Prepare Repository
1. Ensure your code is on GitHub/GitLab
2. Make sure `server/package.json` has:
   ```json
   {
     "name": "server",
     "version": "1.0.0",
     "scripts": {
       "start": "node src/index.js"
     }
   }
   ```

### Step 2.2: Deploy to Render
1. Go to https://render.com and sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository**: Select your GitHub repo
4. **Configure Build Settings**:
   - **Name**: `attendease-api` (or your choice)
   - **Region**: Choose same as MongoDB region
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`

5. **Environment Variables** (click "Advanced"):
   Add these:
   ```
   MONGO_URI = mongodb+srv://admin:YourPassword@attendease.xxxxx.mongodb.net/employee-attendance?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-change-this-to-random-string
   PORT = 5000
   NODE_ENV = production
   ```

6. **Free Plan**: Select **"Free"** tier
7. Click **"Create Web Service"**
8. Wait for deployment (3-5 minutes)
9. ✅ **Copy your backend URL**: `https://attendease-api.onrender.com`

### Step 2.3: Verify Backend
1. Visit: `https://your-backend-url.onrender.com`
2. Should see: Server response (may say "Cannot GET /")
3. Test: `https://your-backend-url.onrender.com/api/auth/login`
   - Should return 400/404 (means API is working)

---

## 3. Frontend Deployment (Vercel)

Vercel is perfect for React/Vite apps with instant deployments.

### Step 3.1: Prepare Frontend
1. Update `client/src/services/api.js` to use environment variable:
   ```javascript
   import axios from 'axios';
   
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   
   const api = axios.create({
       baseURL: API_URL,
       headers: {
           'Content-Type': 'application/json',
       },
   });
   
   // ... rest of your code
   ```

2. Verify `client/package.json` has build script:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

### Step 3.2: Deploy to Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository**: Select your repo
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Environment Variables**:
   Add this variable:
   ```
   VITE_API_URL = https://attendease-api.onrender.com/api
   ```
   (Use YOUR backend URL from Step 2.3)

6. Click **"Deploy"**
7. Wait for deployment (1-2 minutes)
8. ✅ **Your app is live!** `https://attendease.vercel.app`

### Step 3.3: Update Backend CORS
Your backend needs to allow requests from Vercel:

1. Edit `server/src/index.js`:
   ```javascript
   const cors = require('cors');
   
   // Update CORS to allow your frontend
   app.use(cors({
       origin: [
           'http://localhost:5173',  // Local development
           'https://attendease.vercel.app',  // Your Vercel URL
           'https://*.vercel.app'  // All Vercel preview deployments
       ],
       credentials: true
   }));
   ```

2. **Commit and push** changes to GitHub
3. Render will **auto-deploy** the update

---

## 4. Alternative: Railway (Full Stack)

Railway can host both backend and frontend in one project.

### Step 4.1: Deploy to Railway
1. Go to https://railway.app and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects both `client` and `server`

### Step 4.2: Configure Backend Service
1. Click on **server** service
2. Go to **"Variables"** tab
3. Add environment variables:
   ```
   MONGO_URI = your-mongodb-connection-string
   JWT_SECRET = your-jwt-secret
   PORT = 5000
   ```
4. Go to **"Settings"** → **"Networking"**
5. Click **"Generate Domain"**
6. ✅ Copy backend URL

### Step 4.3: Configure Frontend Service
1. Click on **client** service
2. Go to **"Variables"** tab
3. Add:
   ```
   VITE_API_URL = https://your-backend.railway.app/api
   ```
4. Go to **"Settings"** → **"Networking"**
5. Click **"Generate Domain"**
6. ✅ Your app is live!

---

## 5. Environment Variables Reference

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `my-super-secret-key-123` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |

**How to generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `https://api.example.com/api` |

---

## 6. Post-Deployment Steps

### Step 6.1: Seed Production Database
1. **Option A**: Use Render Shell
   - Go to Render dashboard → Your backend service
   - Click **"Shell"** tab
   - Run: `node src/scripts/seed.js`

2. **Option B**: Run locally with production DB
   ```bash
   cd server
   # Update .env with production MONGO_URI
   node src/scripts/seed.js
   ```

### Step 6.2: Test Your App
1. Visit your frontend URL
2. Try logging in:
   - Manager: `manager@example.com` / `password123`
   - Employee: `priya.patel@company.com` / `password123`
3. Test check-in/check-out
4. Test manager features (reports, create employee)
5. Test settings (password change)

### Step 6.3: Custom Domain (Optional)
**Vercel**:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `attendease.com`)
3. Follow DNS configuration instructions

**Render**:
1. Go to Service Settings → Custom Domain
2. Add domain and configure DNS

---

## 7. Troubleshooting

### Issue: Backend won't start on Render

**Symptoms**: Deployment fails or service crashes

**Solutions**:
1. Check **Logs** tab in Render dashboard
2. Verify `package.json` start script: `"start": "node src/index.js"`
3. Ensure all dependencies are in `package.json`
4. Check MongoDB connection string is correct
5. Verify Node version compatibility

### Issue: Frontend can't connect to backend

**Symptoms**: Login fails, "Network Error" in console

**Solutions**:
1. Check `VITE_API_URL` includes `/api` at the end
2. Verify backend URL is correct and accessible
3. Check browser console for CORS errors
4. Ensure backend CORS allows frontend origin
5. Test backend directly: `https://your-backend.com/api/auth/login`

### Issue: MongoDB connection fails

**Symptoms**: "MongooseServerSelectionError"

**Solutions**:
1. Verify IP whitelist (0.0.0.0/0 for testing)
2. Check username/password in connection string
3. Ensure database name is included in URI
4. Verify cluster is running in MongoDB Atlas
5. Check if connection string format is correct

### Issue: CORS errors in production

**Symptoms**: "Access-Control-Allow-Origin" error

**Solutions**:
1. Update `server/src/index.js`:
   ```javascript
   app.use(cors({
       origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
       credentials: true
   }));
   ```
2. Add `FRONTEND_URL` env variable to backend
3. Restart backend service

### Issue: Environment variables not working

**Symptoms**: App uses default/development values

**Solutions**:
1. Verify variables are set in hosting platform (not just .env file)
2. Check variable names match exactly (case-sensitive)
3. For Vite, ensure variables start with `VITE_`
4. Redeploy after adding/changing variables
5. Check build logs for environment variable usage

### Issue: Render free tier sleeps

**Symptoms**: First request takes 30+ seconds

**Solutions**:
1. This is normal for free tier (spins down after 15 min inactivity)
2. Upgrade to paid plan ($7/mo) for always-on
3. Or use external monitoring (e.g., UptimeRobot) to ping every 10 minutes
4. Display loading message: "Waking up server..." on first load

---

## Platform Comparison

| Feature | Render | Vercel | Railway |
|---------|--------|--------|---------|
| **Free Tier** | ✅ Yes | ✅ Yes | ✅ Yes ($5 credit/mo) |
| **Backend** | ✅ Web Service | ❌ No (serverless only) | ✅ Yes |
| **Frontend** | ✅ Static Site | ✅ Best for React | ✅ Yes |
| **Auto-sleep** | ✅ Yes (15 min) | ❌ No | ❌ No |
| **Build Time** | ~3-5 min | ~1-2 min | ~2-3 min |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **Database** | ❌ PostgreSQL only | ❌ None | ✅ PostgreSQL/Redis |
| **Recommended For** | Backend | Frontend | Full-stack |

**Best Combo**: Render (Backend) + Vercel (Frontend) ⭐

---

## Security Checklist

Before going live:

- [ ] Change JWT_SECRET to random 32+ character string
- [ ] Use strong passwords for MongoDB users
- [ ] Enable Multi-Factor Auth on MongoDB Atlas
- [ ] Whitelist specific IPs in production (not 0.0.0.0/0)
- [ ] Never commit .env files to Git
- [ ] Use HTTPS (provided by hosting platforms)
- [ ] Set NODE_ENV=production
- [ ] Review and limit CORS origins
- [ ] Regularly update npm packages
- [ ] Enable MongoDB Atlas backup
- [ ] Monitor database usage and logs

---

## Monitoring & Maintenance

### MongoDB Atlas Monitoring
1. Go to MongoDB Atlas → Clusters → Metrics
2. Monitor:
   - Connections
   - Operation execution times
   - Network traffic
   - Storage usage

### Backend Monitoring (Render)
1. Dashboard → Service → Metrics
2. Check:
   - Response times
   - Error rates
   - Memory usage
   - CPU usage

### Frontend Monitoring (Vercel)
1. Project → Analytics
2. Monitor:
   - Page views
   - Unique visitors
   - Performance scores
   - Build times

---

## Estimated Costs

### Free Tier Limits

**MongoDB Atlas M0**:
- Storage: 512 MB
- RAM: Shared
- Good for: ~1000-5000 users

**Render Free**:
- Hours: 750/month
- Sleeps after 15 min inactivity
- RAM: 512 MB

**Vercel Free**:
- Bandwidth: 100 GB/month
- Builds: 6000 min/month
- Unlimited deployments

**Railway Free**:
- $5 credit/month
- ~500 hours runtime
- 100 GB bandwidth

### When to Upgrade

Upgrade when you reach:
- **10,000+ users**: MongoDB Atlas M10 ($57/mo)
- **Always-on needed**: Render Starter ($7/mo)
- **Custom features**: Paid plans with more resources

---

## Quick Reference Commands

### Test Backend Locally
```bash
cd server
npm install
npm start
```

### Build Frontend Locally
```bash
cd client
npm install
npm run build
npm run preview
```

### Seed Database
```bash
cd server
node src/scripts/seed.js
```

### Check Backend Health
```bash
curl https://your-backend.onrender.com/api/auth/login
```

---

## Success Checklist

After following this guide:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] IP addresses whitelisted
- [ ] Connection string tested locally
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS updated with frontend URL
- [ ] Database seeded with sample data
- [ ] Manager login works
- [ ] Employee login works
- [ ] Check-in/check-out functional
- [ ] Reports working
- [ ] Settings/password change working
- [ ] Custom domain configured (optional)

---

## Need Help?

**MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
**Render Docs**: https://render.com/docs
**Vercel Docs**: https://vercel.com/docs
**Railway Docs**: https://docs.railway.app

**Common MongoDB Atlas Video Tutorial**: https://www.youtube.com/watch?v=rPqRyYJmx2g

---

## 🎉 Congratulations!

Your AttendEase Employee Attendance System is now live in production!

**Demo Credentials**:
- Manager: `manager@example.com` / `password123`
- Employee: `priya.patel@company.com` / `password123`

**Share your deployment**: Send the Vercel URL to users to start tracking attendance! 🚀

---

**Last Updated**: November 2025
**Platform Versions**: Render (Free), Vercel (Hobby), Railway (Starter)
