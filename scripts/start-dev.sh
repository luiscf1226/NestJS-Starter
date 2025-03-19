#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting NestJS API Development Environment${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Start the PostgreSQL database
echo -e "${YELLOW}Starting PostgreSQL database with Docker Compose...${NC}"
docker-compose up -d db

# Wait for the database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Create the database if it doesn't exist
echo -e "${YELLOW}Ensuring database exists...${NC}"
docker-compose exec db psql -U postgres -c "CREATE DATABASE nestjs_db;" || true

# Start the application
echo -e "${GREEN}Starting NestJS application...${NC}"
npm run start:dev 