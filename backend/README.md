# Todo App Backend

A TypeScript-based Node.js backend for a Todo application, built with Express and Inversify.

## Features

- RESTful API endpoints for todo management
- TypeScript for type safety
- Dependency injection using Inversify
- JSON file storage (db.json for tasks, auth.json for users)
- Authentication and authorization
- CORS support
- Body parsing middleware

## Prerequisites

- Node.js 20 or higher
- pnpm package manager

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

To start the development server:

```bash
pnpm run build
pnpm start
```

The server will start on port 3000.

## Available Scripts

- `pnpm run build` - Build the TypeScript code
- `pnpm start` - Start the server
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint issues

## Project Structure

```
src/            # Source code
dist/           # Compiled JavaScript output
db.json         # Task data storage
auth.json       # User authentication data
```

## API Endpoints

- **Authentication**
  - POST `/users/register` - Register a new user
  - POST `/users/login` - Authenticate a user

- **Tasks**
  - GET `/tasks` - Get all tasks for authenticated user
  - GET `/tasks/:id` - Get a specific task
  - POST `/tasks` - Create a new task
  - PUT `/tasks/:id` - Update a task
  - DELETE `/tasks/:id` - Delete a task

## Docker Support

The project includes a Dockerfile for containerization. To build and run the container:

```bash
docker build -t todo-backend .
docker run -p 3000:3000 todo-backend
```

## License

ISC 