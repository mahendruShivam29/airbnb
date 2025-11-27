FROM node:18-alpine

WORKDIR /app

# Copy shared folder
COPY shared ./shared

# Copy service folder
COPY owner-service ./owner-service

# Install shared dependencies
WORKDIR /app/shared
RUN npm install

# Install service dependencies
WORKDIR /app/owner-service
RUN npm install

EXPOSE 4003

CMD ["npm", "start"]
