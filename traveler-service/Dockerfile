FROM node:18-alpine

WORKDIR /app

# Copy shared folder
COPY shared ./shared

# Copy service folder
COPY traveler-service ./traveler-service

# Install shared dependencies
WORKDIR /app/shared
RUN npm install

# Install service dependencies
WORKDIR /app/traveler-service
RUN npm install

EXPOSE 4001

CMD ["npm", "start"]
