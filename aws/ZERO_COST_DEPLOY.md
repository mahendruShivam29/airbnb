# Zero-Cost AWS Deployment Guide for Airbnb Microservices

This guide explains how to deploy your containerized Airbnb application to AWS while staying within the **Free Tier** to minimize or eliminate costs.

## Architecture Overview

To keep costs at $0, we will use a **single EC2 instance** (t2.micro or t3.micro) to host all services using Docker Compose. This avoids the high costs of managed services like EKS, ECS Fargate, or MSK (Managed Kafka).

*   **Compute**: EC2 `t2.micro` or `t3.micro` (Free Tier eligible: 750 hours/month).
*   **Orchestration**: Docker Compose (installed on the EC2 instance).
*   **Database**: MongoDB container running on the same EC2 instance (avoids Atlas costs if you want strictly $0, though Atlas Free Tier is also an option).
*   **Messaging**: Kafka container running on the same EC2 instance.
*   **Storage**: EBS Volume (Free Tier eligible: 30GB).

---

## Prerequisites

1.  **AWS Account**: Create one at [aws.amazon.com](https://aws.amazon.com/).
2.  **SSH Client**: Terminal (Mac/Linux) or PowerShell/PuTTY (Windows).
3.  **Git**: To clone your repository.

---

## Step 1: Launch an EC2 Instance

1.  **Login to AWS Console** and navigate to **EC2**.
2.  Click **Launch Instance**.
3.  **Name**: `airbnb-server`
4.  **AMI**: Select **Ubuntu Server 24.04 LTS** (Free Tier eligible).
5.  **Instance Type**: Select **t2.micro** or **t3.micro** (Check which one is Free Tier eligible in your region).
6.  **Key Pair**:
    *   Click **Create new key pair**.
    *   Name: `airbnb-key`.
    *   Type: `RSA`.
    *   Format: `.pem`.
    *   Download the file and keep it safe!
7.  **Network Settings**:
    *   **Allow SSH traffic from**: `My IP` (For security).
    *   **Allow HTTP traffic from the internet**.
    *   **Allow HTTPS traffic from the internet**.
8.  **Configure Storage**: Set to **25 GB** (Free Tier allows up to 30GB).
9.  Click **Launch Instance**.

---

## Step 2: Configure Security Group

1.  Go to your instance details in the AWS Console.
2.  Click on the **Security** tab -> Click the **Security Group** link.
3.  Click **Edit inbound rules**.
4.  Add the following rules:
    *   **SSH (22)**: My IP (Already there).
    *   **Custom TCP (80)**: Anywhere-IPv4 (`0.0.0.0/0`) - For Frontend.
    *   **Custom TCP (4001)**: Anywhere-IPv4 - Traveler Service (Optional, for debugging).
    *   **Custom TCP (4002)**: Anywhere-IPv4 - Property Service (Optional).
    *   **Custom TCP (4003)**: Anywhere-IPv4 - Owner Service (Optional).
    *   **Custom TCP (8001)**: Anywhere-IPv4 - AI Agent (Optional).
5.  Click **Save rules**.

---

## Step 3: Connect to Your Instance

1.  Open your terminal/PowerShell.
2.  Navigate to where you downloaded `airbnb-key.pem`.
3.  **Restrict permissions** (Linux/Mac only): `chmod 400 airbnb-key.pem`
4.  **Connect**:
    ```bash
    ssh -i "airbnb-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
    ```
    *(Replace `<YOUR_EC2_PUBLIC_IP>` with the Public IPv4 address from the AWS Console)*

---

## Step 4: Install Docker & Docker Compose

Run these commands on your EC2 instance:

```bash
# Update packages
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Install Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (avoids using sudo)
sudo usermod -aG docker $USER
newgrp docker

# CRITICAL: Create Swap Memory (Prevents freeze during build)
# t2.micro has only 1GB RAM. We need swap space for 'npm install'.
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Step 5: Deploy the Application

1.  **Clone your repository**:
    ```bash
    git clone <YOUR_GITHUB_REPO_URL> airbnb
    cd airbnb
    ```
    *(If your repo is private, you'll need to generate a GitHub Personal Access Token and use it in the URL: `https://<TOKEN>@github.com/username/repo.git`)*

2.  **Create Environment File**:
    Create the `.env` file with your production secrets.
    ```bash
    nano .env
    ```
    Paste your environment variables (API keys, etc.):
    ```env
    TAVILY_API_KEY=your_key_here
    GOOGLE_API_KEY=your_key_here
    LLM_PROVIDER=google
    LLM_MODEL=gemini-2.0-flash-exp
    ```
    Press `Ctrl+O`, `Enter`, then `Ctrl+X` to save and exit.

3.  **Update Docker Compose for Production**:
    We need to make a small tweak to `docker-compose.yml` to ensure the frontend listens on port 80 directly.
    
    Edit the file:
    ```bash
    nano docker-compose.yml
    ```
    Find the `client` service and ensure ports are mapped `80:80`:
    ```yaml
    client:
      ports:
        - "80:80"
    ```
    Also, ensure `CLIENT_ORIGIN` in other services points to your EC2 IP:
    ```yaml
    environment:
      CLIENT_ORIGIN: http://<YOUR_EC2_PUBLIC_IP>
    ```

4.  **Start the Application**:
    ```bash
    docker compose up -d --build
    ```

---

## Step 6: Access Your App

Open your browser and visit:
`http://<YOUR_EC2_PUBLIC_IP>`

You should see your Airbnb application running!

---

## Cost Optimization Tips (Zero Cost)

1.  **Stop Instance When Not In Use**: If this is for a demo, stop the instance from the AWS Console when you aren't showing it. This saves your 750 free hours.
2.  **Clean Up Resources**:
    *   `docker system prune -a` to remove unused images and free up space.
    *   Monitor your EBS usage to stay under 30GB.
3.  **Elastic IP**: If you stop/start the instance, the IP changes. You can allocate an **Elastic IP** (static IP) for free **AS LONG AS** it is attached to a running instance. If you stop the instance, AWS charges a small fee for the unattached IP. Release the IP if you plan to keep the instance stopped for a long time.

## Troubleshooting

*   **"Connection Refused"**: Check your Security Group rules (Step 2).
*   **"Memory Error" / OOMKilled**: The `t2.micro` has only 1GB RAM. If your services crash, you might need to enable **Swap Memory**:
    ```bash
    # Create 2GB swap file
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    ```
