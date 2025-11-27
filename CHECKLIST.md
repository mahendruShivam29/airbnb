# ✅ Startup Checklist - Before Running Services

## 1. Infrastructure Status
- [ ] Docker Desktop is running
- [ ] Run: `docker ps --filter "name=airbnb"` to check containers
- [ ] Expected containers: `airbnb-mongodb-local`, `airbnb-kafka`, `airbnb-zookeeper`
- [ ] If not running: `docker-compose -f docker-compose.infrastructure.yml up -d`

## 2. Environment Files

Check these `.env` files exist:

### Traveler Service
- [ ] File exists: `traveler-service\.env`
- [ ] Contains: `MONGODB_URI=mongodb://root:pass123@localhost:27017`
- [ ] Contains: `KAFKA_BROKERS=localhost:9092`

### Owner Service  
- [ ] File exists: `owner-service\.env`
- [ ] Contains: `MONGODB_URI=mongodb://root:pass123@localhost:27017`
- [ ] Contains: `KAFKA_BROKERS=localhost:9092`

### Property Service
- [ ] File exists: `property-service\.env`
- [ ] Contains: `MONGODB_URI=mongodb://root:pass123@localhost:27017`

## 3. Port Availability

Check these ports are free:
- [ ] Port 4001 (Traveler Service)
- [ ] Port 4002 (Property Service) 
- [ ] Port 4003 (Owner Service)
- [ ] Port 5173 (React Client)

**Check with:**
```powershell
netstat -ano | findstr "4001 4002 4003 5173"
```

If any port shows output, kill the process:
```powershell
taskkill /PID <process-id> /F
```

## 4. Dependencies Installed

- [ ] `traveler-service\node_modules` exists
- [ ] `owner-service\node_modules` exists
- [ ] `property-service\node_modules` exists
- [ ] `client\node_modules` exists

**If not, install:**
```powershell
cd traveler-service && npm install
cd ../owner-service && npm install
cd ../property-service && npm install
cd ../client && npm install
```

## 5. Ready to Start!

Once all checkboxes are ✅, run:

```powershell
.\start-all-services.ps1
```

Wait 10-15 seconds, then test:

```powershell
.\test-services.ps1
```

---

## Quick Fixes

### Create Missing .env Files

**Property Service:**
```powershell
cd property-service
@"
PORT=4002
SERVICE_NAME=property-service
MONGODB_URI=mongodb://root:pass123@localhost:27017
CLIENT_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Traveler Service:**
```powershell
cd traveler-service
@"
PORT=4001
SERVICE_NAME=traveler-service
MONGODB_URI=mongodb://root:pass123@localhost:27017
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
PROPERTY_SERVICE_URL=http://localhost:4002
CLIENT_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Owner Service:**
```powershell
cd owner-service
@"
PORT=4003
SERVICE_NAME=owner-service
MONGODB_URI=mongodb://root:pass123@localhost:27017
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
CLIENT_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding UTF8
```
