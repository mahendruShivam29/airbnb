# 🚀 HOW TO START & TEST - Quick Reference

## ⚡ FASTEST WAY TO START

**Option 1: Windows Command Prompt (cmd.exe)**
Double-click `start-all.bat`

**Option 2: Git Bash**
Run `./start-all.sh`

**Option 3: Manual Start (Most Reliable)**
Open 4 separate terminals and run:

1. **Traveler Service:**
   ```bash
   cd traveler-service
   npm run dev
   ```

2. **Owner Service:**
   ```bash
   cd owner-service
   npm run dev
   ```

3. **Property Service:**
   ```bash
   cd property-service
   npm run dev
   ```

4. **React Client:**
   ```bash
   cd client
   npm run dev
   ```

---

## 📋 Before You Start

### 1. Create Missing .env Files

**Property Service** - Create `property-service/.env`:
```env
PORT=4002
SERVICE_NAME=property-service
MONGODB_URI=mongodb://root:pass123@localhost:27017/?authSource=admin
CLIENT_ORIGIN=http://localhost:5173
```

**Traveler Service** - Verify `traveler-service/.env`:
```env
PORT=4001
SERVICE_NAME=traveler-service
MONGODB_URI=mongodb://root:pass123@localhost:27017/?authSource=admin
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
PROPERTY_SERVICE_URL=http://localhost:4002
CLIENT_ORIGIN=http://localhost:5173
```

**Owner Service** - Verify `owner-service/.env`:
```env
PORT=4003
SERVICE_NAME=owner-service
MONGODB_URI=mongodb://root:pass123@localhost:27017/?authSource=admin
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
CLIENT_ORIGIN=http://localhost:5173
```

---

## 🎯 STEP-BY-STEP Testing Flow

### Step 1: Start Services
Use one of the methods above. Wait 15 seconds.

### Step 2: Test Health
Run:
```bash
./test-services.sh
```
Or manually:
```bash
curl http://localhost:4001/health
curl http://localhost:4003/health
curl http://localhost:4002/health
```

### Step 3: Test Frontend
Open browser: **http://localhost:5173**

### Step 4: Create Traveler Account
- Click "Sign Up"
- Email: `traveler@test.com`
- Password: `password123`
- Role: TRAVELER
- Click "Create Account"

### Step 5: Create Owner Account (Incognito Window)
- Open Incognito/Private window
- Go to http://localhost:5173
- Click "Sign Up"
- Email: `owner@test.com`
- Password: `password123`
- Role: OWNER
- Click "Create Account"

### Step 6: Test Kafka Message Flow

**As Traveler (normal window):**
1. Login as `traveler@test.com`
2. Browse properties
3. Create a booking
4. **Check Traveler Service window** - Look for:
   ```
   📤 Published booking request to Kafka
   ```

**As Owner (incognito window):**
1. Login as `owner@test.com`
2. **Check Owner Service window immediately** - Look for:
   ```
   📥 Received booking request from Kafka
   ```
3. Go to Bookings/Dashboard
4. Find the new booking
5. Click "Accept" or "Decline"
6. **Check Owner Service window** - Look for:
   ```
   📤 Published booking response to Kafka
   ```

**Back to Traveler (normal window):**
1. **Check Traveler Service window** - Look for:
   ```
   📥 Received booking response from Kafka
   ✅ Updated booking status: ACCEPTED
   ```
2. Refresh your Bookings page
3. Verify status changed to "ACCEPTED" ✅

---

## 🛑 How to Stop

Close all service windows (or Ctrl+C in each), then:
```bash
docker-compose -f docker-compose.infrastructure.yml down
```
