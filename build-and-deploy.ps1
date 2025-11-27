# Build and Deploy Script for Airbnb Microservices on Kubernetes (Windows)

Write-Host "Starting Build and Deploy Process..." -ForegroundColor Green

# 1. Check for Minikube
if (Get-Command minikube -ErrorAction SilentlyContinue) {
    Write-Host "Minikube found. Configuring Docker environment..."
    minikube docker-env | Invoke-Expression
} else {
    Write-Host "Minikube not found. Assuming Docker Desktop Kubernetes or remote cluster." -ForegroundColor Yellow
}

# 2. Build Docker Images
Write-Host "Building Docker images..." -ForegroundColor Cyan

Write-Host "Building traveler-service..."
docker build -t traveler-service:latest -f traveler-service/Dockerfile .

Write-Host "Building owner-service..."
docker build -t owner-service:latest -f owner-service/Dockerfile .

Write-Host "Building property-service..."
docker build -t property-service:latest -f property-service/Dockerfile .

Write-Host "Building ai-agent..."
docker build -t ai-agent:latest -f ai-agent/Dockerfile .

Write-Host "Building client..."
docker build -t client:latest -f client/Dockerfile .

# 3. Create Namespace
Write-Host "Creating namespace..." -ForegroundColor Cyan
kubectl create namespace airbnb --dry-run=client -o yaml | kubectl apply -f -

# 4. Apply Secrets and ConfigMap
Write-Host "Applying configuration..." -ForegroundColor Cyan
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# 5. Apply Infrastructure
Write-Host "Deploying infrastructure (MongoDB, Kafka)..." -ForegroundColor Cyan
kubectl apply -f k8s/infrastructure/mongodb.yaml
kubectl apply -f k8s/infrastructure/kafka.yaml

# Wait for infrastructure to be ready (optional, but good practice)
Write-Host "Waiting for infrastructure to initialize (30s)..."
Start-Sleep -Seconds 30

# 6. Apply Services
Write-Host "Deploying microservices..." -ForegroundColor Cyan
kubectl apply -f k8s/traveler-service.yaml
kubectl apply -f k8s/owner-service.yaml
kubectl apply -f k8s/property-service.yaml
kubectl apply -f k8s/ai-agent.yaml
kubectl apply -f k8s/client.yaml

# 7. Apply Ingress
Write-Host "Deploying Ingress..." -ForegroundColor Cyan
kubectl apply -f k8s/ingress.yaml

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Check status with: kubectl get pods -n airbnb"
Write-Host "Access client at: http://localhost:30000 (if using NodePort on Minikube)"
