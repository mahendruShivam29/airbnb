# Step-by-Step Testing & Deployment Guide

## Phase 1: Local Setup & Testing (30 minutes)

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb"

# Install shared dependencies
cd shared
npm install

# Install Traveler Service dependencies
cd ../traveler-service
npm install

# Install Owner Service dependencies
cd ../owner-service
npm install

# Install Redux in client (if not already done)
cd ../client
npm install
```

### Step 2: Start Infrastructure with Docker Compose

Create a simplified infrastructure file for local testing:

**File: `docker-compose.local.yml`**

```bash
# Create infrastructure-only compose file
cat > docker-compose.local.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: airbnb-mongodb-local
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: pass123
    volumes:
      - mongodb_data:/data/db

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: airbnb-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: airbnb-kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'

volumes:
  mongodb_data:
EOF

# Start infrastructure
docker-compose -f docker-compose.local.yml up -d

# Wait for services to be ready (30 seconds)
echo "Waiting for MongoDB and Kafka to start..."
sleep 30
```

### Step 3: Configure Environment Variables

```bash
# Traveler Service
cd traveler-service
cat > .env << 'EOF'
PORT=4001
SERVICE_NAME=traveler-service
MONGODB_URI=mongodb://root:pass123@localhost:27017
JWT_SECRET=my-super-secret-jwt-key
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
PROPERTY_SERVICE_URL=http://localhost:4002
CLIENT_ORIGIN=http://localhost:5173
EOF

# Owner Service
cd ../owner-service
cat > .env << 'EOF'
PORT=4003
SERVICE_NAME=owner-service
MONGODB_URI=mongodb://root:pass123@localhost:27017
JWT_SECRET=my-super-secret-jwt-key
JWT_EXPIRES_IN=7d
KAFKA_BROKERS=localhost:9092
CLIENT_ORIGIN=http://localhost:5173
EOF
```

### Step 4: Start Microservices

Open **3 separate terminals**:

**Terminal 1: Traveler Service**
```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\traveler-service"
npm run dev
```

**Terminal 2: Owner Service**
```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\owner-service"
npm run dev
```

**Terminal 3: React Client**
```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb\client"
npm run dev
```

### Step 5: Update Client to Use Redux

Open `client/src/main.jsx` and wrap with Redux Provider:

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

## Phase 2: Test Kafka Message Flow (15 minutes)

### Test 1: Create Traveler Account

1. **Open browser**: http://localhost:5173
2. Click "Sign Up"
3. Fill form:
   - Email: `traveler@test.com`
   - Password: `password123`
   - First Name: `John`
   - Last Name: `Doe`
   - Role: **TRAVELER**
4. Click Submit

**Expected Result**: 
- Login successful
- Token stored in localStorage
- Redirected to home page

**Check Redux**: Open Redux DevTools → State → `auth`
```json
{
  "user": { "email": "traveler@test.com", "role": "TRAVELER" },
  "token": "eyJhbGci...",
  "isAuthenticated": true
}
```

### Test 2: Create Booking (Triggers Kafka)

1. Search for properties (use existing property ID or create one)
2. Click "Book Now"
3. Select dates and guests
4. Submit booking

**Check Traveler Service Terminal**:
```
📤 Published booking request: 654abc123
```

**Check MongoDB**:
```bash
# Connect to MongoDB
mongosh "mongodb://root:pass123@localhost:27017"

use airbnb_traveler
db.bookings.find().pretty()
# Should show booking with status: 'PENDING'
```

### Test 3: Owner Receives Booking Request

1. **Open incognito window**: http://localhost:5173
2. Sign up as Owner:
   - Email: `owner@test.com`
   - Role: **OWNER**
3. Navigate to bookings page

**Check Owner Service Terminal**:
```
📥 Received booking request: {bookingId: "654abc123", ...}
✅ Booking request saved: 654abc123
```

**Check MongoDB**:
```bash
use airbnb_owner
db.ownerbookings.find().pretty()
# Should show same booking
```

### Test 4: Owner Accepts Booking

1. In Owner dashboard, click "Accept" on booking
2. Confirm action

**Check Owner Service Terminal**:
```
📤 Published booking response: 654abc123 - ACCEPTED
```

**Check Traveler Service Terminal**:
```
📥 Received booking response: {bookingId: "654abc123", status: "ACCEPTED"}
✅ Updated booking 654abc123 to status: ACCEPTED
```

### Test 5: Traveler Sees Updated Status

1. Go back to traveler window
2. Refresh bookings page
3. Status should be **ACCEPTED**

**Check Redux DevTools**: Booking status updated

---

## Phase 3: Kubernetes Deployment (45 minutes)

### Option A: Minikube (Free - Recommended)

#### Step 1: Install Minikube

**Windows (with Chocolatey)**:
```bash
choco install minikube
```

**Or download installer**: https://minikube.sigs.k8s.io/docs/start/

#### Step 2: Start Minikube

```bash
# Start with adequate resources
minikube start --cpus=4 --memory=8192 --driver=docker

# Enable addons
minikube addons enable metrics-server
minikube addons enable ingress

# Verify
kubectl get nodes
```

#### Step 3: Build Docker Images

```bash
cd "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb"

# Build Traveler Service
cd traveler-service
docker build -t traveler-service:latest .

# Build Owner Service
cd ../owner-service
docker build -t owner-service:latest .

# Load images into Minikube
minikube image load traveler-service:latest
minikube image load owner-service:latest

# Verify images
minikube image ls | grep traveler
```

#### Step 4: Deploy to Kubernetes

```bash
# Deploy infrastructure
kubectl apply -f k8s/infrastructure/namespace.yaml
kubectl apply -f k8s/infrastructure/mongodb.yaml
kubectl apply -f k8s/infrastructure/kafka.yaml

# Wait for infrastructure (this takes ~2 minutes)
kubectl wait --for=condition=ready pod -l app=mongodb -n airbnb --timeout=300s
kubectl wait --for=condition=ready pod -l app=kafka -n airbnb --timeout=300s

# Deploy services
kubectl apply -f k8s/traveler-service.yaml
kubectl apply -f k8s/owner-service.yaml

# Check status
kubectl get pods -n airbnb

# Wait for all pods to be Running
kubectl wait --for=condition=ready pod --all -n airbnb --timeout=300s
```

#### Step 5: Access Services

```bash
# Port forward Traveler Service
kubectl port-forward -n airbnb svc/traveler-service 4001:4001

# In another terminal, port forward Owner Service
kubectl port-forward -n airbnb svc/owner-service 4003:4003

# Test health endpoints
curl http://localhost:4001/health
curl http://localhost:4003/health
```

#### Step 6: Take Screenshots for Report

```bash
# Get all resources
kubectl get all -n airbnb

# Get pods (SCREENSHOT THIS)
kubectl get pods -n airbnb -o wide

# Get services
kubectl get svc -n airbnb

# Get HPA
kubectl get hpa -n airbnb

# View logs
kubectl logs deployment/traveler-service -n airbnb --tail=50
kubectl logs deployment/owner-service -n airbnb --tail=50

# Open Kubernetes dashboard
minikube dashboard
# SCREENSHOT the dashboard
```

### Option B: AWS EKS (For Production Screenshots)

Follow the detailed guide in `aws/AWS_DEPLOY_GUIDE.md`. Key steps:

```bash
# 1. Install eksctl
choco install eksctl

# 2. Create cluster (takes 15-20 minutes)
eksctl create cluster --name airbnb-cluster --region us-east-1 --nodes 2

# 3. Create ECR repositories
aws ecr create-repository --repository-name traveler-service
aws ecr create-repository --repository-name owner-service

# 4. Build and push images
# (Follow guide in AWS_DEPLOY_GUIDE.md)

# 5. Deploy to EKS
kubectl apply -f k8s/

# 6. TAKE SCREENSHOTS

# 7. DELETE CLUSTER (Important!)
eksctl delete cluster --name airbnb-cluster
```

---

## Phase 4: JMeter Performance Testing (30 minutes)

### Step 1: Install JMeter

**Windows (Chocolatey)**:
```bash
choco install jmeter
```

**Or download**: https://jmeter.apache.org/download_jmeter.cgi

### Step 2: Create Authentication Test Plan

1. Open JMeter GUI:
```bash
jmeter
```

2. **Create Test Plan**:
   - Right-click Test Plan → Add → Threads → Thread Group
   - **Name**: Auth Load Test
   - **Number of Threads**: ${__P(users,100)}
   - **Ramp-up Period**: 30
   - **Loop Count**: 10

3. **Add HTTP Request**:
   - Right-click Thread Group → Add → Sampler → HTTP Request
   - **Name**: Traveler Signup
   - **Server**: localhost
   - **Port**: 4001
   - **Method**: POST
   - **Path**: /api/traveler/auth/signup
   - **Body Data**:
```json
{
  "email": "test${__threadNum}@example.com",
  "password": "password123",
  "firstName": "User",
  "lastName": "${__threadNum}",
  "role": "TRAVELER"
}
```

4. **Add Header Manager**:
   - Right-click HTTP Request → Add → Config Element → HTTP Header Manager
   - Add: `Content-Type: application/json`

5. **Add Listeners**:
   - Right-click Thread Group → Add → Listener → Summary Report
   - Add → Listener → View Results Tree
   - Add → Listener → Graph Results

6. **Save as**: `jmeter/auth-test.jmx`

### Step 3: Run Tests

```bash
# Create results directory
mkdir -p results reports

# Run with 100 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-100.jtl -Jusers=100

# Run with 200 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-200.jtl -Jusers=200

# Run with 300 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-300.jtl -Jusers=300

# Run with 400 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-400.jtl -Jusers=400

# Run with 500 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-500.jtl -Jusers=500
```

### Step 4: Generate Reports

```bash
# Generate HTML dashboard
jmeter -g results/auth-100.jtl -o reports/auth-100
jmeter -g results/auth-200.jtl -o reports/auth-200
jmeter -g results/auth-300.jtl -o reports/auth-300
jmeter -g results/auth-400.jtl -o reports/auth-400
jmeter -g results/auth-500.jtl -o reports/auth-500

# Open report
start reports/auth-100/index.html
```

### Step 5: Create Performance Graph (Excel)

1. Extract data from each report
2. Create table:

| Users | Avg Response (ms) | Throughput (req/s) | Error % |
|-------|-------------------|-------------------|---------|
| 100   | [from report]     | [from report]     | [calc]  |
| 200   | ...               | ...               | ...     |
| 300   | ...               | ...               | ...     |
| 400   | ...               | ...               | ...     |
| 500   | ...               | ...               | ...     |

3. Create line chart with Users (X) vs Response Time (Y)
4. Add error rate as secondary axis
5. Screenshot the graph

---

## Phase 5: Screenshots for Report

### Checklist of Required Screenshots:

#### Local Testing
- [ ] Redux DevTools showing auth state after login
- [ ] Redux DevTools showing booking created
- [ ] Traveler Service logs showing "📤 Published booking request"
- [ ] Owner Service logs showing "📥 Received booking request"
- [ ] Owner Service logs showing "📤 Published booking response"
- [ ] Traveler Service logs showing status update

#### Kubernetes
- [ ] `kubectl get pods -n airbnb` (all Running)
- [ ] `kubectl get svc -n airbnb`
- [ ] `kubectl get hpa -n airbnb`
- [ ] `kubectl describe pod <traveler-pod> -n airbnb`
- [ ] Minikube dashboard showing all services

#### JMeter
- [ ] Summary Report for each user count (100-500)
- [ ] Performance graph (Excel chart)
- [ ] Response time over time graph

#### AWS (Optional)
- [ ] EKS Cluster dashboard
- [ ] EC2 instances running
- [ ] ECR repositories with images
- [ ] LoadBalancer accessible

---

## Phase 6: Complete Report

1. Open `REPORT_TEMPLATE.md`
2. Fill in actual results from your tests
3. Insert screenshots
4. Add analysis of performance bottlenecks
5. Document any challenges faced

---

## Common Issues & Solutions

### Issue: Kafka connection refused
**Solution**:
```bash
# Check Kafka is running
docker ps | grep kafka

# Check Kafka logs
docker logs airbnb-kafka

# Restart if needed
docker-compose -f docker-compose.local.yml restart kafka
```

### Issue: MongoDB authentication failed
**Solution**:
```bash
# Update connection string in .env
MONGODB_URI=mongodb://root:pass123@localhost:27017/?authSource=admin
```

### Issue: Pods stuck in "Pending"
**Solution**:
```bash
# Check events
kubectl describe pod <pod-name> -n airbnb

# Check resources
kubectl top nodes
minikube addons enable metrics-server
```

### Issue: Images not found in Minikube
**Solution**:
```bash
# Rebuild and reload
docker build -t traveler-service:latest traveler-service/
minikube image load traveler-service:latest

# Update deployment
kubectl rollout restart deployment/traveler-service -n airbnb
```

---

## Timeline Estimate

- **Phase 1** (Local Setup): 30 minutes
- **Phase 2** (Kafka Testing): 15 minutes
- **Phase 3** (Kubernetes): 45 minutes
- **Phase 4** (JMeter): 30 minutes
- **Phase 5** (Screenshots): 20 minutes
- **Phase 6** (Report): 60 minutes

**Total**: ~3.5 hours

---

## Quick Commands Reference

```bash
# Check everything running locally
docker ps
lsof -i :4001  # Traveler Service
lsof -i :4003  # Owner Service
lsof -i :5173  # React Client

# Kubernetes quick status
kubectl get all -n airbnb
kubectl logs -f deployment/traveler-service -n airbnb
kubectl exec -it deployment/traveler-service -n airbnb -- sh

# MongoDB queries
mongosh "mongodb://root:pass123@localhost:27017"
use airbnb_traveler
db.bookings.find()

# Kafka topics
docker exec -it airbnb-kafka kafka-topics --list --bootstrap-server localhost:9092

# Clean up and restart
docker-compose -f docker-compose.local.yml down -v
kubectl delete namespace airbnb
```

---

## Final Checklist Before Submission

- [ ] All services run locally without errors
- [ ] Kafka message flow works end-to-end
- [ ] Deployed to Kubernetes (Minikube or AWS)
- [ ] JMeter tests completed for all user counts
- [ ] All required screenshots taken
- [ ] Report filled with actual data
- [ ] Code committed to GitHub
- [ ] README updated with deployment instructions
- [ ] .env.example files included (not .env with secrets!)

---

Good luck with your Lab 2! 🚀
