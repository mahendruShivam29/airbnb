FROM node:18-alpine

WORKDIR /app

# Copy shared folder
COPY shared ./shared

# Copy service folder
COPY property-service ./property-service

# Install shared dependencies
WORKDIR /app/shared
RUN npm install

# Install service dependencies
WORKDIR /app/property-service
RUN npm install

EXPOSE 4002

CMD ["npm", "start"]
