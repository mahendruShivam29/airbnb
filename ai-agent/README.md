# AI Agent Microservice

AI-powered trip concierge service for the Airbnb application. This microservice uses Google's Gemini AI to generate personalized travel itineraries based on user bookings and preferences.

## Features

- 🤖 **AI-Powered Trip Planning**: Uses Google Gemini to create detailed travel itineraries
- 🔍 **Smart Search Integration**: Leverages Tavily API for real-time POI and event discovery
- ☁️ **Weather Integration**: Fetches weather forecasts using Open-Meteo API
- 📊 **MongoDB Integration**: Retrieves user booking history from MongoDB
- 🎯 **Personalized Recommendations**: Considers dietary needs, mobility requirements, and interests
- 📦 **Packing Lists**: Generates weather-appropriate packing checklists

## Tech Stack

- **Framework**: FastAPI (Python)
- **AI**: Google Gemini via LangChain
- **Database**: MongoDB (PyMongo)
- **Search**: Tavily API
- **Weather**: Open-Meteo API

## Architecture

This service is part of a microservices architecture:

```
┌─────────────────┐
│  Client (React) │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
┌────────▼────────┐           ┌────────▼────────────┐
│ Travel Services │           │   AI Agent (PORT    │
│ (Traveler,      │           │   8001) - PYTHON    │
│  Owner,         │◄──────────┤                     │
│  Property)      │           │   - MongoDB Access  │
└────────┬────────┘           │   - Gemini AI       │
         │                    │   - Tavily Search   │
         │                    └─────────────────────┘
┌────────▼────────┐
│    MongoDB      │
│  - Bookings     │
│  - Properties   │
└─────────────────┘
```

## Prerequisites

- Python 3.11+
- MongoDB (running locally or via Docker)
- Google API Key (for Gemini AI)
- Tavily API Key (optional, for enhanced search)

## Setup

### 1. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```bash
# Required
GOOGLE_API_KEY=your-google-api-key-here      # Get from https://aistudio.google.com/app/apikey
LLM_PROVIDER=google
LLM_MODEL=gemini-2.0-flash-exp

# Optional (improves search results)
TAVILY_API_KEY=your-tavily-key-here          # Get from https://tavily.com

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017        # Use mongodb://mongodb:27017 in Docker
MONGODB_BOOKING_DB=airbnb_booking
MONGODB_PROPERTY_DB=airbnb_property

# Server
PORT=8001
CORS_ORIGIN=http://localhost:5173
```

### 2. Install Dependencies

#### Option A: Using Virtual Environment (Recommended for local development)

**Windows:**
```bash
# Run the startup script (it handles everything)
.\start-ai-agent.bat
```

Or manually:
```bash
# Create virtual environment
python -m venv .venv

# Activate it
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

**Linux/Mac:**
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

#### Option B: Using Docker

```bash
# From project root
docker-compose up ai-agent
```

## API Endpoints

### POST `/agent/plan`

Generate a personalized trip itinerary.

**Request Body:**

```json
{
  "booking": {
    "location": "San Francisco, CA",
    "startDate": "2025-12-01",
    "endDate": "2025-12-03",
    "partyType": "family",
    "guests": 4
  },
  "preferences": {
    "budgetTier": "$$",
    "interests": ["museums", "parks", "local culture"],
    "mobilityNeeds": ["wheelchair accessible"],
    "dietary": ["vegan", "gluten-free"]
  },
  "freeText": "I want kid-friendly activities"
}
```

**Or use latest booking:**

```json
{
  "use_latest_booking_for_user_id": "user123",
  "preferences": {
    "budgetTier": "$$$",
    "interests": ["fine dining", "art galleries"]
  }
}
```

**Response:**

```json
{
  "itinerary": [
    {
      "date": "2025-12-01",
      "blocks": [
        {
          "block": "morning",
          "activities": [
            {
              "title": "Golden Gate Park Walk",
              "address": "Golden Gate Park, SF",
              "lat": 37.7694,
              "lon": -122.4862,
              "price_tier": "$",
              "duration_minutes": 120,
              "tags": ["outdoor", "family-friendly"],
              "wheelchair_friendly": true,
              "child_friendly": true,
              "url": "https://..."
            }
          ]
        }
      ]
    }
  ],
  "restaurants": [...],
  "packing_checklist": ["Light jacket", "Comfortable shoes", "Umbrella"],
  "meta": {
    "canonical_location": "San Francisco, CA, USA",
    "geo": {"lat": 37.7749, "lon": -122.4194},
    "source": "agent-google"
  }
}
```

## Integration with Frontend

The frontend should call this service when the user opens the "AI Concierge" feature:

```javascript
const response = await fetch('http://localhost:8001/agent/plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    use_latest_booking_for_user_id: userId, // Or provide booking object
    preferences: {
      budgetTier: selectedBudget,
      interests: selectedInterests,
      mobilityNeeds: selectedMobilityNeeds,
      dietary: selectedDietary
    },
    freeText: userInput
  })
});

const plan = await response.json();
```

## MongoDB Schema

The service expects the following MongoDB collections:

### Bookings Collection (airbnb_booking.bookings)

```javascript
{
  _id: ObjectId,
  propertyId: String,
  travelerId: String,
  checkInDate: Date,
  checkOutDate: Date,
  guests: Number,
  status: String,
  createdAt: Date
}
```

### Properties Collection (airbnb_property.properties)

```javascript
{
  _id: String,
  title: String,
  location: String,
  pricePerNight: Number,
  ownerId: String,
  ...
}
```

## Testing

### Check Service Health

```bash
curl http://localhost:8001/docs
```

This opens the FastAPI auto-generated API documentation.

### Test the API

```bash
curl -X POST http://localhost:8001/agent/plan \
  -H "Content-Type: application/json" \
  -d '{
    "booking": {
      "location": "San Jose, CA",
      "startDate": "2025-12-01",
      "endDate": "2025-12-03",
      "partyType": "family",
      "guests": 2
    },
    "preferences": {
      "budgetTier": "$$"
    }
  }'
```

## Troubleshooting

### Service not starting

1. **Check Python version**: `python --version` (should be 3.11+)
2. **Check if port 8001 is available**: `netstat -ano | findstr :8001`
3. **Check MongoDB is running**: Ensure MongoDB is accessible at the configured URI

### MongoDB connection errors

1. **Local development**: Ensure MongoDB is running (`mongod` or Docker)
2. **Check connection string**: Verify `MONGODB_URI` in `.env`
3. **Check database names**: Ensure they match your other services

### AI not working

1. **Check API key**: Verify `GOOGLE_API_KEY` in `.env`
2. **Check model name**: Ensure `LLM_MODEL` is valid (e.g., `gemini-2.0-flash-exp`)
3. **Check logs**: The service will fall back to stub data if AI fails

### No bookings found

1. **Check user ID**: The `travelerId` must match exactly
2. **Check database**: Verify bookings exist in MongoDB
3. **Check collection names**: Ensure using `bookings` (plural)

## Development

### Add new features

1. Modify `main.py`
2. The service auto-reloads in development mode (`--reload` flag)

### Update dependencies

```bash
pip install <new-package>
pip freeze > requirements.txt
```

## Deployment

### Docker (Production)

```bash
# Build image
docker build -t airbnb-ai-agent .

# Run container
docker run -p 8001:8001 \
  -e GOOGLE_API_KEY=your-key \
  -e MONGODB_URI=mongodb://mongodb:27017 \
  airbnb-ai-agent
```

### Kubernetes

See `k8s/` directory in the project root for Kubernetes manifests.

## API Documentation

Once the service is running, visit:

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## License

Part of the Airbnb Clone project for DATA236 Distributed Systems.
