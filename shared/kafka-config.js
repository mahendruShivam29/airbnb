/**
 * Shared Kafka Configuration
 * Used across all microservices for consistent message broker setup
 */

export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'];

export const KAFKA_CLIENT_ID = process.env.SERVICE_NAME || 'airbnb-service';

export const TOPICS = {
  BOOKING_REQUESTS: 'booking.requests',
  BOOKING_RESPONSES: 'booking.responses',
  STATUS_UPDATES: 'booking.status.updates',
  PROPERTY_UPDATES: 'property.updates',
};

export const CONSUMER_GROUPS = {
  TRAVELER_SERVICE: 'traveler-service-group',
  OWNER_SERVICE: 'owner-service-group',
  BOOKING_SERVICE: 'booking-service-group',
};

export const KAFKA_CONFIG = {
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  retry: {
    initialRetryTime: 300,
    retries: 8,
  },
};
