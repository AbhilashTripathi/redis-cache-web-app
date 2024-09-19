# redis-cache-web-app

## Dockerized Web App
This project contains a simple web application with a React frontend and a Node.js backend, interacting with MongoDB and Redis. The entire application is containerized using Docker and orchestrated with Docker Compose.

Prerequisites:
 - Docker
 - Docker Compose

**Getting Started**
 - Build and start the services:
   - docker-compose up --build
 - To run frontend: npm run dev
    - Access the web application: Open your browser and navigate to http://localhost:8765

**Services**
 - Web App: React frontend and Node.js backend
 - MongoDB: Database for storing items
 - Redis: Cache for storing temporary values

**Network Configuration**

All services are in the same Docker network with subnet 172.16.230.0/24.

Persistence:

MongoDB and Redis data are persisted using Docker volumes:
 - MongoDB data: ./data/mongodb
 - Redis data: ./data/redis

**Endpoints**
 - Database operations:
     - GET http://localhost:8765/db: Retrieve all items
     - POST http://localhost:8765/db: Add a new item
 - Cache operations:
     - GET http://localhost:8765/cache: Retrieve cached value

**Stopping the Services**
 - To stop the services, use:
    - docker compose down
 - To stop the services and remove the volumes, use:
    - docker compose down -v
