# NestJS API with PostgreSQL

A robust RESTful API built with NestJS and PostgreSQL, following Clean Architecture principles and SOLID design patterns.

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
- [Repository Pattern](#repository-pattern)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🚀 Features

- **RESTful API endpoints** for complete CRUD operations
- **User management** with status control (active, inactive, pending)
- **Clean Architecture** implementation with separation of concerns
- **Repository Pattern** for database abstraction
- **Custom complex queries** including filtering, aggregation, and batch operations
- **Robust validation** using class-validator with detailed error messages
- **Swagger documentation** for API exploration and testing
- **PostgreSQL integration** with TypeORM for type-safe database operations
- **Docker and Docker Compose** for containerized development and deployment
- **Status transition validation** with business rule enforcement

## 💻 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Robust relational database
- **ORM**: [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- **Validation**: [class-validator](https://github.com/typestack/class-validator) - Decorator-based validation
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/) - API documentation
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Testing**: Jest and Supertest for unit and e2e testing

## 📂 Project Structure

The project follows a modular structure with clean architecture principles:

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── config/                 # Configuration files
├── modules/                # Feature modules
│   └── users/              # Users module
│       ├── dto/            # Data Transfer Objects
│       │   ├── create-user.dto.ts
│       │   ├── update-user.dto.ts
│       │   ├── update-user-status.dto.ts
│       │   └── user-response.dto.ts
│       ├── entities/       # Database entities
│       │   └── user.entity.ts
│       ├── repositories/   # Custom repositories
│       │   └── users.repository.ts
│       ├── users.controller.ts  # REST API controllers
│       ├── users.service.ts     # Business logic services
│       └── users.module.ts      # Module definition
└── shared/                 # Shared utilities and common code
    ├── exceptions/         # Custom exceptions
    ├── filters/            # Exception filters
    ├── guards/             # Guards for authorization
    ├── interceptors/       # Interceptors for request handling
    └── pipes/              # Custom pipes for validation
```

## 🏛 Architecture

The application follows the principles of Clean Architecture with clear separation of concerns:

### Layers

1. **Controller Layer** (users.controller.ts)
   - Handles HTTP requests and responses
   - Routes endpoints to service methods
   - Performs input validation
   - Responsible for Swagger documentation

2. **Service Layer** (users.service.ts)
   - Implements business logic and rules
   - Handles status transitions and validation
   - Orchestrates repository calls
   - Transforms data between repositories and controllers

3. **Repository Layer** (users.repository.ts)
   - Abstracts database operations
   - Implements custom queries
   - Provides data access methods
   - Handles database transactions

4. **Entity Layer** (user.entity.ts)
   - Defines database schema
   - Maps to database tables
   - Contains entity relationships
   - Defines column types and constraints

5. **DTO Layer** (dto/*.dto.ts)
   - Defines data transfer objects for API input/output
   - Implements validation rules
   - Documents API contracts

### Design Patterns

- **Repository Pattern**: Abstracts database operations
- **Dependency Injection**: NestJS's built-in DI container
- **DTO Pattern**: For request/response data shaping
- **Decorator Pattern**: For validation and metadata
- **Module Pattern**: For feature organization

## 🔧 Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- Docker and Docker Compose
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL with Docker Compose**
   ```bash
   docker-compose up -d db
   ```

5. **Run database migrations**
   ```bash
   npm run migration:run
   ```

6. **Start the application**
   ```bash
   npm run start:dev
   ```

7. **Access the API documentation**
   ```
   http://localhost:3001/api
   ```

### Docker Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the API documentation**
   ```
   http://localhost:3001/api
   ```

## 📝 API Documentation

The API documentation is available through Swagger UI at `http://localhost:3001/api` when the application is running.

### Endpoints

#### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/active` - Get all active users
- `GET /users/:id` - Get a user by ID
- `PATCH /users/:id` - Update a user
- `PATCH /users/:id/status` - Update user status
- `DELETE /users/:id` - Delete a user

### Data Models

#### User

```typescript
{
  id: number;           // Unique identifier
  name: string;         // User's full name
  email: string;        // User's email address
  status: UserStatus;   // ACTIVE, INACTIVE, or PENDING
  created_at: Date;     // Creation timestamp
  updated_at: Date;     // Last update timestamp
}
```

#### UserStatus Enum

```typescript
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}
```

## 📊 Repository Pattern

The application implements a custom repository pattern for enhanced database operations:

### Key Features

1. **Encapsulation of Database Logic**
   - Database operations are abstracted away from business logic
   - Service layer remains clean and focused on business rules

2. **Custom Query Methods**
   - Complex WHERE conditions with TypeORM's query builder
   - Custom filtering methods (e.g., by email pattern, date range)

3. **Aggregation Queries**
   - Statistical data computation (e.g., getUsersCountByMonth)
   - Performance optimization for complex calculations

4. **Batch Operations**
   - Efficient handling of multiple operations (e.g., bulkCreate)
   - Transaction support for data integrity

5. **Caching**
   - Response caching for frequently accessed data
   - Configurable caching strategies

### Examples

```typescript
// Complex query with filtering
async findUsersByEmailPattern(pattern: string): Promise<User[]> {
  return this.repository.find({
    where: {
      email: Like(`%${pattern}%`),
    },
  });
}

// Aggregation query
async getUsersCountByMonth(): Promise<{ month: string; count: number }[]> {
  return this.repository
    .createQueryBuilder('user')
    .select('DATE_TRUNC(\'month\', created_at) as month')
    .addSelect('COUNT(*) as count')
    .groupBy('month')
    .orderBy('month', 'DESC')
    .getRawMany();
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run specific tests
npm run test:watch

# Generate test coverage
npm run test:cov
```

### End-to-End Tests

```bash
# Run all e2e tests
npm run test:e2e
```

## 🚢 Deployment

### Prerequisites

- Docker and Docker Compose
- A PostgreSQL database

### Steps

1. **Build the Docker image**
   ```bash
   docker build -t nestjs-api .
   ```

2. **Set environment variables**
   ```bash
   # Configure production environment variables
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Run database migrations**
   ```bash
   docker exec -it nestjs-api npm run migration:run
   ```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ♥ using NestJS
# NestJS-Starter
# NestJS-Starter
