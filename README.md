# API Gateway

## Overview

This API Gateway is built with TypeScript and Express.js. It serves as a central entry point for microservices, providing routing, authentication, authorization and more. The gateway facilitates communication between clients and services while implementing important features like rate limiting and caching.

## Features

### Request Routing
- The API Gateway routes incoming requests to appropriate backend services based on the URL path.
- It dynamically determines the target service based on service names provided in the request.

### Load balancing
- Scalability & High Availability: The API Gateway is deployed behind an NGINX load balancer, which distributes incoming requests across multiple gateway instances. This ensures better performance, fault tolerance, and the ability to handle higher traffic loads.

- Can be scalled horizontally via Docker Compose or Kubernetes.

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
- nginx: the round-robin load balancer.

- user: Service for user management, connected to MongoDB.

- products: Service for product management, using Redis for caching.

- mongo: MongoDB instance for user data.

- redis: Redis instance for caching responses.

### Limitations

- No Built-in Monitoring: The current setup lacks integrated monitoring and alerting capabilities, making it harder to track performance and detect issues in real time.

- Static Configuration: NGINX requires manual updates to the configuration file to scale services, which can be cumbersome in dynamic environments.

- No Distributed Tracing: The absence of tracing makes it difficult to debug issues across microservices, particularly in complex interactions.

### Potential Add-On Features
- Kubernetes Integration: Transition the deployment to Kubernetes for better orchestration, automated scaling, and improved fault tolerance across services.

- Centralized Logging: Implement centralized logging solutions (e.g., ELK Stack) to collect and analyze logs from all services for easier debugging and monitoring.

- Monitoring & Alerting: Integrate Prometheus and Grafana to monitor metrics, visualize performance, and set up alerts for anomalies or system failures.

- Distributed Tracing: Use OpenTelemetry or Jaeger to implement distributed tracing, providing insights into request flow and performance bottlenecks across microservices.

- API Gateway Features: Enhance the gateway with additional features like API versioning, throttling, and advanced authentication mechanisms.
