# Todo App - Full Stack TypeScript Application

A complete task management application with a Node.js backend and React frontend.

## Project Structure

This project consists of two main parts:

- **Backend**: A Node.js/Express API with TypeScript
- **Frontend**: A Next.js application with TypeScript and React 19

## Backend

The backend is a RESTful API built with:

- Node.js
- Express
- TypeScript
- Inversify for dependency injection
- JSON file storage (db.json for tasks, auth.json for users)

### API Endpoints

- **Authentication**
  - POST `/users/register` - Register a new user
  - POST `/users/login` - Authenticate a user

- **Tasks**
  - GET `/tasks` - Get all tasks for authenticated user
  - GET `/tasks/:id` - Get a specific task
  - POST `/tasks` - Create a new task
  - PUT `/tasks/:id` - Update a task
  - DELETE `/tasks/:id` - Delete a task

For easier testing, a Postman collection is available. Import `Todo API.postman_collection.json` into Postman to access all API endpoints with sample request data.

## Frontend

The frontend is a single-page application built with:

- Next.js 15.2.4
- React 19.0.0
- TypeScript
- ESLint for code linting

### Features

- User authentication (login/register)
- Task management dashboard
- Create, read, update, and delete tasks

## Authentication

The application uses authentication with user credentials stored in the auth.json file. 

## Approach and Design Choices

### Backend Architecture

The backend implements a clean architecture approach with clear separation of concerns:

1. **Dependency Injection**: Using InversifyJS to implement IoC (Inversion of Control) for better testability and loose coupling
2. **Repository Pattern**: Abstracting data access through repositories to isolate the application from the underlying storage
3. **Service Layer**: Encapsulating business logic in dedicated service classes
4. **RESTful API Design**: Following REST principles with proper HTTP verbs and resource-based routing
5. **Stateless Authentication**: Basic Authentication to maintain a simple and secure API

### Data Storage Decisions

I chose a file-based JSON storage solution for simplicity and ease of setup:
- `db.json` stores all user tasks with properties including deadlines and completion status
- `auth.json` securely stores user credentials with password hashing
- This approach eliminates database setup requirements while still providing data persistence


### Security Implementation

1. **Password Security**: bcrypt for password hashing with salt rounds
2. **Basic Authentication**: Secure username/password authentication using HTTP Authorization headers

### Deployment Strategy

The application supports both traditional deployment and containerization:
- Docker support for the backend allows for easy deployment in various environments
- The frontend and backend can be deployed independently or together
- You can run both frontend and backend simultaneously using Docker Compose:
  ```
  docker compose up -d --build
  ```

## Future Improvements

Future enhancements planned for this project:

1. **JWT Authentication**: Replace Basic Authentication with JWT-based token authentication for improved security and stateless operation
2. **Database Integration**: Migrate from JSON file storage to MongoDB or another database solution for better scalability and performance
3. **Zod Validation**: Implement Zod for robust input/output validation on backend APIs to ensure data integrity
4. **Consistent Error Handling**: Implement a standardized error handling framework to provide consistent error responses and logging across all controllers 

## Getting Started

### Prerequisites

- Node.js and package manager (npm or pnpm)

### Running the Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
pnpm install
```

3. Start the server:
```
pnpm run build
pnpm start
```

The backend will run on http://localhost:3000

### Running the Frontend

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

The frontend will run on http://localhost:4000

## Development

Both the frontend and backend use TypeScript for type safety. The project uses a monorepo structure, but each part can be developed and deployed independently.

## Docker Support

The backend includes a Dockerfile for containerization. # todo-ts-nodejs-react
