# Kubernetes Deployment Guide

## Prerequisites
- Minikube or any Kubernetes cluster
- kubectl configured
- Docker Desktop running

## Step 1: Build Docker Images

```bash
# Build Traveler Service
cd traveler-service
docker build -t traveler-service:latest .

# Build Owner Service
cd ../owner-service
docker build -t owner-service:latest .

# If using Minikube, load images into Minikube
minikube image load traveler-service:latest
minikube image load owner-service:latest
```

## Step 2: Deploy Infrastructure

```bash
# Apply namespace, ConfigMap, and Secrets
kubectl apply -f k8s/infrastructure/namespace.yaml

# Deploy MongoDB
kubectl apply -f k8s/infrastructure/mongodb.yaml

# Deploy Kafka and Zookeeper
kubectl apply -f k8s/infrastructure/kafka.yaml

# Wait for infrastructure to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n airbnb --timeout=300s
kubectl wait --for=condition=ready pod -l app=kafka -n airbnb --timeout=300s
```

## Step 3: Deploy Services

```bash
# Deploy Traveler Service
kubectl apply -f k8s/traveler-service.yaml

# Deploy Owner Service
kubectl apply -f k8s/owner-service.yaml

# Deploy Ingress
kubectl apply -f k8s/infrastructure/ingress.yaml
```

## Step 4: Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n airbnb

# Check services
kubectl get svc -n airbnb

# Check HPAs
kubectl get hpa -n airbnb

# View logs
kubectl logs -f deployment/traveler-service -n airbnb
kubectl logs -f deployment/owner-service -n airbnb
```

## Step 5: Test Services

```bash
# Port forward to test locally
kubectl port-forward -n airbnb svc/traveler-service 4001:4001
kubectl port-forward -n airbnb svc/owner-service 4003:4003

# Test health endpoints
curl http://localhost:4001/health
curl http://localhost:4003/health
```

## Common Issues

### Pods not starting
```bash
kubectl describe pod <pod-name> -n airbnb
kubectl logs <pod-name> -n airbnb
```

### MongoDB connection errors
```bash
# Check MongoDB is running
kubectl exec -it mongodb-0 -n airbnb -- mongosh

# Test connection from service
kubectl exec -it <pod-name> -n airbnb -- sh
nc -zv mongodb 27017
```

### Kafka connection errors
```bash
# Check Kafka topics
kubectl exec -it deployment/kafka -n airbnb -- kafka-topics --list --bootstrap-server localhost:9092
```

## Cleanup

```bash
# Delete all resources
kubectl delete namespace airbnb
```
