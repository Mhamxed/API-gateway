# API Gateway

## Overview

This API Gateway is built with TypeScript and Express.js. It serves as a central entry point for microservices, providing routing, authentication, authorization and more. The gateway facilitates communication between clients and services while implementing important features like rate limiting and caching.

## Features

### Request Routing
- The API Gateway routes incoming requests to appropriate backend services based on the URL path.
- It dynamically determines the target service based on service names provided in the request.

### Rate Limiting
- Implemented using a sliding window algorithm using linked lists to prevent abuse by limiting the number of requests from individual clients.
- Configurable limits based on user authentication or IP address.

### Caching
- Response caching to improve performance and reduce latency.
- Cached responses are stored in Redis and returned for subsequent identical requests.

### JWT Authentication & Authorization
- Uses JSON Web Tokens (JWT) for secure authentication.
- Upon successful login, users receive a JWT that is required for accessing protected routes.

### Role-Based Access Control
- Supports role-based access control to manage permissions.
- Users can be assigned roles (e.g., admin, user), allowing for restricted access to specific endpoints.

### Docker Support
- The application is containerized using Docker for easy deployment.
- Services include the API Gateway, user service, products service, Redis for caching, and MongoDB for user data storage.

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Mhamxed/API-gateway
   cd API-gateway
   ```

2. Build and start the services using Docker Compose:

    ```bash 
    docker-compose up --build
    Access the API Gateway at http://localhost:8000.
    ```

### Configuration
- Create a .env file in the root directory to define your environment variables:

    ```bash
    JWT_SECRET=your_jwt_secret
    ```
### API Endpoints
#### Authentication
- POST /auth/register: Register a new user.

- POST /auth/login: Authenticate a user and receive a JWT.

User Service
- GET /user/*: Access user-related endpoints (e.g., get user details).

Products Service
- GET /products/*: Access product-related endpoints.

### Rate Limiting
- Rate limiting is enforced using Redis.

- The default limit is set to 100 requests per 15 minutes per user.

### Caching
- Responses from services are cached in Redis for 5 minutes.

- Cache keys are generated based on the request URL.

- Role-Based Access Control
Users can have roles such as admin or user.

- Middleware checks user roles to restrict access to certain endpoints.

### Docker
- The application is structured with individual Dockerfiles for each service.

- Use Docker Compose to manage multi-container deployments.

- Docker Compose Services
- gateway: The main API Gateway service.

- user: Service for user management, connected to MongoDB.

- products: Service for product management, using Redis for caching.

- mongo: MongoDB instance for user data.

- redis: Redis instance for caching responses.
