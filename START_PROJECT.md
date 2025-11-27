# Quick Start Guide - Lab 2 Microservices

## Prerequisites ✅
- Docker Desktop running
- Node.js installed
- Dependencies installed (npm install in all services) ✅

---

## Step 1: Start Infrastructure (MongoDB + Kafka)

Open **Git Bash** or **PowerShell** and run:

```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb"

# Start MongoDB and Kafka
docker-compose -f docker-compose.infrastructure.yml up -d

# Wait for services to be healthy (takes ~30 seconds)
echo "Waiting for MongoDB and Kafka to start..."
sleep 30

# Verify they're running
docker ps
```

**Expected Output**: You should see 3 containers running:
- `airbnb-mongodb-local`
- `airbnb-zookeeper`
- `airbnb-kafka`

---

## Step 2: Configure Environment Variables

### Traveler Service
```bash
cd traveler-service
cat > .env << 'EOF'
PORT=4001
SERVICE_NAME=traveler-service
MONGODB_URI=mongodb://root:pass123@localhost:27017
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
PROPERTY_SERVICE_URL=http://localhost:4002
CLIENT_ORIGIN=http://localhost:5173
EOF
```

### Owner Service
```bash
cd ../owner-service
cat > .env << 'EOF'
PORT=4003
SERVICE_NAME=owner-service
MONGODB_URI=mongodb://root:pass123@localhost:27017
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
CLIENT_ORIGIN=http://localhost:5173
EOF
```

**Or copy manually**:
- Traveler Service: Create `.env` in `traveler-service/` folder
- Owner Service: Create `.env` in `owner-service/` folder
- Use the content shown above

---

## Step 3: Start Microservices

You need **4 separate terminals**. Open them all:

### Terminal 1: Traveler Service
```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\traveler-service"
npm run dev
```

**Expected Output**:
```
✅ MongoDB connected: airbnb_traveler
✅ Kafka Consumer started (Traveler Service)
✅ Kafka Producer connected (Traveler Service)
🚀 Traveler Service running on http://localhost:4001
```

### Terminal 2: Owner Service
```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\owner-service"
npm run dev
```

**Expected Output**:
```
✅ MongoDB connected: airbnb_owner
✅ Kafka Consumer started (Owner Service)
✅ Kafka Producer connected (Owner Service)
🚀 Owner Service running on http://localhost:4003
```

### Terminal 3: React Client
```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\client"
npm run dev
```

**Expected Output**:
```
VITE v5.4.2  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Terminal 4: (Optional) Original Server
If you want to use the original server for property management:
```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\server"
npm run dev
```

---

## Step 4: Update Client to Use Redux

Open `client/src/main.jsx` and wrap App with Redux Provider:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

---

## Step 5: Test the Application

1. **Open Browser**: http://localhost:5173

2. **Create Traveler Account**:
   - Click "Sign Up"
   - Email: `traveler@test.com`
   - Password: `password123`
   - Role: **TRAVELER**

3. **Create a Booking** (if properties exist):
   - Search for properties
   - Click "Book"
   - Select dates and guests
   - Submit

4. **Check Traveler Terminal**: Look for:
   ```
   POST /api/traveler/bookings
   📤 Published booking request: <booking-id>
   ```

5. **Open Incognito Window**: http://localhost:5173

6. **Create Owner Account**:
   - Sign Up as Owner
   - Email: `owner@test.com`
   - Role: **OWNER**

7. **Check Owner Terminal**: Look for:
   ```
   📥 Received booking request: {bookingId: "...", ...}
   ✅ Booking request saved: <booking-id>
   ```

8. **Owner Accepts Booking**:
   - View bookings
   - Click "Accept"

9. **Check Owner Terminal**:
   ```
   📤 Published booking response: <booking-id> - ACCEPTED
   ```

10. **Check Traveler Terminal**:
    ```
    📥 Received booking response: {bookingId: "...", status: "ACCEPTED"}
    ✅ Updated booking <booking-id> to status: ACCEPTED
    ```

11. **Refresh Traveler's Bookings**: Status should show "ACCEPTED"

---

## Quick Verification Checklist

- [ ] MongoDB container running (`docker ps`)
- [ ] Kafka container running
- [ ] Traveler Service shows "🚀 Traveler Service running"
- [ ] Owner Service shows "🚀 Owner Service running"
- [ ] Client accessible at http://localhost:5173
- [ ] Can create Traveler account
- [ ] Can create Owner account
- [ ] Booking creates Kafka message (check logs)
- [ ] Owner receives booking request (check logs)
- [ ] Owner can accept/decline
- [ ] Traveler sees status update

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**:
```bash
# Check MongoDB is running
docker ps | grep mongodb

# If not running, restart infrastructure
docker-compose -f docker-compose.infrastructure.yml restart mongodb

# Wait 10 seconds, then restart services
```

### Issue: "Kafka connection refused"
**Solution**:
```bash
# Check Kafka is running
docker ps | grep kafka

# Restart Kafka
docker-compose -f docker-compose.infrastructure.yml restart kafka

# Wait 20 seconds, then restart services
```

### Issue: "Port already in use"
**Solution**:
```bash
# Find what's using the port (Windows)
netstat -ano | findstr :4001
netstat -ano | findstr :4003

# Kill the process
taskkill /PID <process-id> /F
```

### Issue: Services start but no Kafka messages
**Solution**:
```bash
# Check if topics exist
docker exec -it airbnb-kafka kafka-topics --list --bootstrap-server localhost:9092

# Should show:
# booking.requests
# booking.responses

# If not, Kafka will auto-create them on first message
```

---

## Stop Everything

```bash
# Stop all services with Ctrl+C in each terminal

# Stop infrastructure
docker-compose -f docker-compose.infrastructure.yml down

# To completely clean up (removes data)
docker-compose -f docker-compose.infrastructure.yml down -v
```

---

## Next Steps

Once everything is running:

1. ✅ Test Kafka message flow (as described above)
2. Deploy to Kubernetes (see `KUBERNETES_DEPLOY.md`)
3. Run JMeter tests (see `jmeter/README.md`)
4. Take screenshots
5. Fill out report (see `REPORT_TEMPLATE.md`)

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Traveler Service | http://localhost:4001 | Traveler auth, bookings |
| Owner Service | http://localhost:4003 | Owner auth, booking responses |
| React Client | http://localhost:5173 | Frontend UI |
| MongoDB | localhost:27017 | Database |
| Kafka | localhost:9092 | Message broker |

**Health Checks**:
```bash
curl http://localhost:4001/health
curl http://localhost:4003/health
```

---

Good luck! 🚀
