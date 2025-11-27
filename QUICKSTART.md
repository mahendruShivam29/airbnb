# 🚀 Quick Start Guide - Complete Testing Workflow

This guide will help you start, test, and manage all microservices for the Airbnb Lab 2 project.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (Automated)](#quick-start-automated)
3. [Manual Start](#manual-start)
4. [Testing the Application](#testing-the-application)
5. [Troubleshooting](#troubleshooting)
6. [Stopping Services](#stopping-services)

---

## ✅ Prerequisites

Before starting, ensure you have:
- ✅ **Docker Desktop** running (for MongoDB & Kafka)
- ✅ **Node.js** installed (v16 or higher)
- ✅ **npm dependencies** installed in all services:
  ```powershell
  cd traveler-service && npm install
  cd ../owner-service && npm install
  cd ../property-service && npm install
  cd ../client && npm install
  ```

---

## 🚀 Quick Start (Automated)

### **Step 1: Start All Services**

Simply run this PowerShell script:

```powershell
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb"
.\start-all-services.ps1
```

This will:
- ✅ Check if MongoDB & Kafka are running (start them if not)
- ✅ Open separate windows for each service:
  - Traveler Service (Port 4001)
  - Owner Service (Port 4003)
  - Property Service (Port 4002)
  - React Client (Port 5173)

**Wait 10-15 seconds** for all services to fully start.

---

### **Step 2: Test Services**

Run the test script to verify all services are healthy:

```powershell
.\test-services.ps1
```

Expected output:
```
✅ Traveler Service - OK
✅ Owner Service - OK
✅ Property Service - OK
✅ React Client - OK

🎉 All services are running correctly!
```

---

## 📝 Manual Start (Alternative)

If you prefer to start services manually:

### **1. Start Infrastructure**
```powershell
docker-compose -f docker-compose.infrastructure.yml up -d
```

Wait 30 seconds for MongoDB and Kafka to be ready.

### **2. Start Services (4 separate terminals)**

**Terminal 1 - Traveler Service:**
```powershell
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\traveler-service"
npm run dev
```
Expected: `✅ MongoDB connected` and `🚀 Traveler Service running on http://localhost:4001`

**Terminal 2 - Owner Service:**
```powershell
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\owner-service"
npm run dev
```
Expected: `✅ MongoDB connected` and `🚀 Owner Service running on http://localhost:4003`

**Terminal 3 - Property Service:**
```powershell
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\property-service"
npm run dev
```
Expected: `🚀 Property Service running on http://localhost:4002`

**Terminal 4 - React Client:**
```powershell
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\client"
npm run dev
```
Expected: `➜ Local: http://localhost:5173/`

---

## 🧪 Testing the Application

### **Test 1: Create Accounts**

1. **Open Browser**: http://localhost:5173

2. **Create Traveler Account**:
   - Click "Sign Up"
   - Email: `traveler@test.com`
   - Password: `password123`
   - Role: **TRAVELER**
   - Click "Create Account"

3. **Open Incognito Window**: http://localhost:5173

4. **Create Owner Account**:
   - Click "Sign Up"
   - Email: `owner@test.com`
   - Password: `password123`
   - Role: **OWNER**
   - Click "Create Account"

---

### **Test 2: Test Kafka Message Flow**

#### **As Traveler (Normal Window):**

1. **Login** as `traveler@test.com`
2. **Browse Properties** (ensure some exist)
3. **Create a Booking**:
   - Select check-in/check-out dates
   - Enter number of guests
   - Click "Book Now"

4. **Check Traveler Service Terminal** - You should see:
   ```
   POST /api/traveler/bookings
   📤 Published booking request to Kafka
   ✅ Booking created: {bookingId: "..."}
   ```

---

#### **As Owner (Incognito Window):**

1. **Login** as `owner@test.com`
2. **Check Owner Service Terminal** - You should see:
   ```
   📥 Received booking request from Kafka
   ✅ Booking request saved: {bookingId: "..."}
   ```

3. **Navigate to "Bookings" or "Dashboard"**
4. **Find the booking request**
5. **Click "Accept"** (or "Decline")

6. **Check Owner Service Terminal** - You should see:
   ```
   PATCH /api/owner/bookings/:id
   📤 Published booking response to Kafka
   ✅ Booking updated to: ACCEPTED
   ```

---

#### **Back to Traveler (Normal Window):**

1. **Check Traveler Service Terminal** - You should see:
   ```
   📥 Received booking response from Kafka
   ✅ Updated booking status: ACCEPTED
   ```

2. **Refresh the Bookings page**
3. **Verify** the booking status changed to **"ACCEPTED"** ✅

---

### **Test 3: Verify Kafka Topics**

```powershell
# List Kafka topics
docker exec -it airbnb-kafka kafka-topics --list --bootstrap-server localhost:9092

# Should show:
# booking.requests
# booking.responses
```

---

### **Test 4: Check Health Endpoints**

```powershell
# Test each service health
curl http://localhost:4001/health
curl http://localhost:4003/health
curl http://localhost:4002/health
```

All should return `200 OK` with health status.

---

## 🔧 Troubleshooting

### **Issue: MongoDB Authentication Failed**

**Symptom:**
```
❌ MongoDB connection error: Authentication failed
```

**Solution:**
1. Verify `.env` file exists in the service folder
2. Check `MONGODB_URI` contains credentials:
   ```env
   MONGODB_URI=mongodb://root:pass123@localhost:27017
   ```
3. Restart the service

---

### **Issue: Kafka Connection Refused**

**Symptom:**
```
Error: Connection refused to Kafka broker
```

**Solution:**
```powershell
# Check if Kafka is running
docker ps | findstr kafka

# If not running, restart infrastructure
docker-compose -f docker-compose.infrastructure.yml restart kafka

# Wait 20 seconds, then restart services
```

---

### **Issue: Port Already in Use**

**Symptom:**
```
Error: Port 4001 is already in use
```

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :4001

# Kill the process (replace <PID> with the actual process ID)
taskkill /PID <PID> /F

# Or use the stop script
.\stop-all-services.ps1
```

---

### **Issue: No Kafka Messages Flowing**

**Checks:**
1. ✅ Both services show "Kafka Consumer started"
2. ✅ Both services show "Kafka Producer connected"
3. ✅ Kafka container is healthy: `docker ps`
4. ✅ Topics exist (they auto-create on first message)

**Debug:**
```powershell
# Check Kafka logs
docker logs airbnb-kafka --tail 50

# Restart Kafka
docker-compose -f docker-compose.infrastructure.yml restart kafka
```

---

### **Issue: React Client Shows Blank Page**

**Solution:**
1. Check browser console for errors (F12)
2. Verify API endpoints in `client/src/config` point to:
   - Traveler: `http://localhost:4001`
   - Owner: `http://localhost:4003`
3. Check CORS settings in service code

---

## 🛑 Stopping Services

### **Quick Stop (Automated)**

```powershell
.\stop-all-services.ps1
```

This will:
- Stop all services (ports 4001, 4002, 4003, 5173)
- Optionally stop infrastructure (MongoDB/Kafka)

---

### **Manual Stop**

1. **Press `Ctrl+C`** in each service terminal
2. **Stop infrastructure:**
   ```powershell
   docker-compose -f docker-compose.infrastructure.yml down
   ```

3. **Clean up (removes all data):**
   ```powershell
   docker-compose -f docker-compose.infrastructure.yml down -v
   ```

---

## 📊 Service URLs Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **Traveler Service** | http://localhost:4001 | Traveler auth & bookings |
| **Owner Service** | http://localhost:4003 | Owner auth & booking responses |
| **Property Service** | http://localhost:4002 | Property management |
| **React Client** | http://localhost:5173 | Frontend UI |
| **MongoDB** | localhost:27017 | Database |
| **Kafka** | localhost:9092 | Message broker |

---

## 🎯 Next Steps

Once everything is working:

1. ✅ **Test Kafka Flow** (as described above)
2. 📸 **Take Screenshots** of:
   - Service terminals showing Kafka messages
   - Frontend showing booking flow
   - MongoDB data (use MongoDB Compass)
3. 🐳 **Deploy to Kubernetes** (see `KUBERNETES_DEPLOY.md`)
4. ⚡ **Run JMeter Tests** (see `jmeter/README.md`)
5. 📝 **Complete Report** (see `REPORT_TEMPLATE.md`)

---

## 📞 Quick Commands

```powershell
# Start everything
.\start-all-services.ps1

# Test health
.\test-services.ps1

# Stop everything
.\stop-all-services.ps1

# View infrastructure status
docker ps --filter "name=airbnb"

# View all logs
docker-compose -f docker-compose.infrastructure.yml logs -f

# Restart infrastructure
docker-compose -f docker-compose.infrastructure.yml restart
```

---

**Good luck with your testing! 🚀**

For detailed testing scenarios, see `TESTING_GUIDE.md`.
For deployment, see `KUBERNETES_DEPLOY.md`.
