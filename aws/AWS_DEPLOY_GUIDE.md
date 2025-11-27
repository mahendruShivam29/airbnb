# AWS Deployment Guide for Students (Cost-Effective)

## Cost-Saving Strategy

**Total estimated monthly cost: $0-20** (staying within free tier)

### Free/Low-Cost Options:
1. ✅ **EKS Free Tier**: First 12 months free for cluster management
2. ✅ **EC2 Free Tier**: t2.micro instances (750 hours/month)
3. ✅ **ECR**: 500 MB storage/month free
4. ✅ **Data Transfer**: 1 GB/month free
5. ⚠️ **Alternative**: Use **AWS Academy** credits if available from your course

## Option 1: Minimal AWS Deployment (Recommended for Students)

### Prerequisites
- AWS Account (use educational email for credits)
- AWS CLI installed
- kubectl installed
- eksctl installed

### Step 1: Install eksctl
```bash
# Mac
brew tap weaveworks/tap
brew install weaveworks/tap/eksctl

# Windows - use Chocolatey
choco install eksctl

# Verify
eksctl version
```

### Step 2: Create EKS Cluster (Minimal Config)
```bash
# Create cluster with minimal resources
eksctl create cluster \
  --name airbnb-cluster \
  --region us-east-1 \
  --nodegroup-name airbnb-nodes \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed

# This takes ~15 minutes
```

**Cost**: ~$60/month for 2 t3.medium nodes (⚠️ Remember to delete after testing!)

### Step 3: Configure kubectl
```bash
# Update kubeconfig
aws eks update-kubeconfig --name airbnb-cluster --region us-east-1

# Verify connection
kubectl get nodes
```

### Step 4: Create ECR Repositories
```bash
# Create repositories for each service
aws ecr create-repository --repository-name traveler-service --region us-east-1
aws ecr create-repository --repository-name owner-service --region us-east-1

# Get login credentials
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

### Step 5: Build and Push Docker Images
```bash
# Get your AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

# Build and push Traveler Service
cd traveler-service
docker build -t traveler-service:latest .
docker tag traveler-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/traveler-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/traveler-service:latest

# Build and push Owner Service
cd ../owner-service
docker build -t owner-service:latest .
docker tag owner-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/owner-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/owner-service:latest
```

### Step 6: Update K8s Manifests with ECR Images
```bash
# Update image URLs in k8s/traveler-service.yaml
# Change: image: traveler-service:latest
# To: image: <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/traveler-service:latest
```

### Step 7: Deploy to EKS
```bash
# Deploy all resources
kubectl apply -f k8s/infrastructure/
kubectl apply -f k8s/

# Check deployment
kubectl get pods -n airbnb
kubectl get svc -n airbnb
```

### Step 8: Install NGINX Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml

# Get LoadBalancer URL
kubectl get svc -n ingress-nginx
```

### Step 9: Take Screenshots
1. **EKS Cluster**: AWS Console > EKS > Clusters
2. **EC2 Instances**: AWS Console > EC2 > Instances (showing running nodes)
3. **ECR Repositories**: AWS Console > ECR > Repositories (showing pushed images)
4. **kubectl get pods**: Terminal showing all running pods
5. **Application Running**: Browser showing app via LoadBalancer URL

## Option 2: Minikube (100% Free - For Development/Testing)

If AWS costs are a concern, use Minikube locally:

```bash
# Install Minikube
# Mac
brew install minikube

# Windows
choco install minikube

# Start Minikube
minikube start --cpus=4 --memory=8192

# Enable metrics server for HPA
minikube addons enable metrics-server

# Deploy application
kubectl apply -f k8s/infrastructure/
kubectl apply -f k8s/

# Access services
minikube service traveler-service -n airbnb
```

**Screenshots for Report**:
- Minikube dashboard: `minkube dashboard`
- Running pods: `kubectl get pods -n airbnb`
- Service endpoints: `minikube service list -n airbnb`

## ⚠️ CRITICAL: Clean Up AWS Resources

**Delete everything after demonstration to avoid charges!**

```bash
# Delete all K8s resources
kubectl delete namespace airbnb

# Delete EKS cluster
eksctl delete cluster --name airbnb-cluster --region us-east-1

# Delete ECR repositories
aws ecr delete-repository --repository-name traveler-service --force --region us-east-1
aws ecr delete-repository --repository-name owner-service --force --region us-east-1

# Verify deletion
aws eks list-clusters
aws ecr describe-repositories
```

## Cost Monitoring

```bash
# Check AWS costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## Screenshots Required for Report

1. ✅ AWS EKS Cluster Dashboard
2. ✅ EC2 Instances (worker nodes running)
3. ✅ ECR showing Docker images
4. ✅ `kubectl get pods -n airbnb` output
5. ✅ `kubectl get svc -n airbnb` output
6. ✅ Application accessible via LoadBalancer URL
7. ✅ CloudWatch Logs (optional)

## Alternative: AWS Academy Learner Lab

If your course provides AWS Academy access:
1. Use Learner Lab credits (typically $100)
2. Follow same steps but in Learner Lab environment
3. Resources auto-terminate after session

## Estimated Timeline
- EKS Cluster Creation: 15-20 minutes
- Image Build & Push: 10-15 minutes
- Deployment: 5-10 minutes
- **Total**: ~45 minutes

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n airbnb
kubectl logs <pod-name> -n airbnb
```

### ECR authentication issues
```bash
# Re-login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

### LoadBalancer not accessible
```bash
# Check ingress
kubectl get ingress -n airbnb
kubectl describe ingress airbnb-ingress -n airbnb
```
