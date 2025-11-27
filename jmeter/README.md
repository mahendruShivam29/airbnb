# JMeter Load Testing Guide

## Test Plans

This directory contains JMeter test plans for performance testing the Airbnb microservices.

### Test Plans Included:

1. **auth-test.jmx** - Authentication load testing
2. **property-test.jmx** - Property search load testing
3. **booking-test.jmx** - Booking flow end-to-end testing

## Running Tests

### Install JMeter
```bash
# Download from https://jmeter.apache.org/download_jmeter.cgi
# Or use Homebrew (Mac)
brew install jmeter

# Or use Chocolatey (Windows)
choco install jmeter
```

### Run Tests from Command Line

#### Authentication Test (100 users)
```bash
jmeter -n -t jmeter/auth-test.jmx -l results/auth-100.jtl -Jusers=100 -Jrampup=30
```

#### Run all user levels (100, 200, 300, 400, 500)
```bash
# Create results directory
mkdir -p results

# 100 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-100.jtl -Jusers=100 -Jrampup=30

# 200 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-200.jtl -Jusers=200 -Jrampup=30

# 300 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-300.jtl -Jusers=300 -Jrampup=30

# 400 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-400.jtl -Jusers=400 -Jrampup=30

# 500 users
jmeter -n -t jmeter/auth-test.jmx -l results/auth-500.jtl -Jusers=500 -Jrampup=30
```

### Generate HTML Reports
```bash
# Generate HTML dashboard from results
jmeter -g results/auth-100.jtl -o reports/auth-100

# Open report
open reports/auth-100/index.html  # Mac
start reports/auth-100/index.html  # Windows
```

## Test Scenarios

### 1. Authentication Test
- **Endpoint**: POST `/api/traveler/auth/signup` and `/api/traveler/auth/login`
- **Users**: 100, 200, 300, 400, 500
- **Ramp-up**: 30 seconds
- **Loops**: 10
- **Metrics**: Response time, throughput, error rate

### 2. Property Search Test
- **Endpoint**: GET `/api/properties?location=...`
- **Users**: 100, 200, 300, 400, 500
- **Metrics**: Query performance, response time

### 3. Booking Flow Test
- **Endpoints**: 
  - POST `/api/traveler/bookings` (create booking)
  - GET `/api/owner/bookings` (owner views)
  - PUT `/api/owner/bookings/:id/accept` (accept booking)
- **Metrics**: End-to-end time, Kafka latency

## Expected Results

### Performance Benchmarks
| Users | Avg Response Time (ms) | Throughput (req/s) | Error Rate (%) |
|-------|------------------------|-------------------|----------------|
| 100   | < 500                  | > 50              | < 1            |
| 200   | < 1000                 | > 80              | < 2            |
| 300  | < 1500                 | > 100             | < 5            |
| 400   | < 2000                 | > 120             | < 10           |
| 500   | < 3000                 | > 140             | < 15           |

## Analysis Guide

### Key Metrics to Analyze:
1. **Average Response Time**: Should increase gradually with user count
2. **95th Percentile**: Indicates worst-case performance
3. **Throughput**: Requests processed per second
4. **Error Rate**: Should remain low until system saturation
5. **CPU/Memory**: Monitor Kubernetes pods during tests

### Create Performance Graph
Use Excel or Google Sheets:
- X-axis: Concurrent Users (100, 200, 300, 400, 500)
- Y-axis: Average Response Time (ms)
- Include error rate as secondary axis

### Bottleneck Analysis
Common bottlenecks:
- **Database**: MongoDB queries taking too long
- **Kafka**: Message queue latency
- **CPU**: Pods hitting resource limits
- **Network**: Inter-service communication delays

## Viewing Results in JMeter GUI

```bash
# Open JMeter GUI
jmeter

# Load test results: File > Open > select .jtl file
# View graphs: Add > Listener > Graph Results
```

## Tips for Student Budget

- Run tests on local Kubernetes (Minikube) to avoid AWS costs
- Test during off-peak hours
- Use smaller dataset initially
- Monitor resource usage with `kubectl top pods -n airbnb`
