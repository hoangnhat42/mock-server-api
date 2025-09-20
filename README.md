# Mock Server API

A dynamic mock API server built with Node.js, Express, and PostgreSQL that allows you to register custom endpoints and return mock data.

## Features

- 🔐 API Key authentication via `X-API-Key` header
- 📝 Dynamic endpoint registration
- 🗄️ PostgreSQL database with Sequelize ORM
- 📚 Swagger/OpenAPI documentation
- 🐳 Docker support
- 🔄 Auto-updating endpoints (upsert functionality)
- 📊 JSONB data storage for flexible mock responses

## Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: API Key
- **Documentation**: Swagger UI
- **Containerization**: Docker & Docker Compose

## Quick Start

### Using Docker (Recommended)

1. Clone the repository and navigate to the project directory
2. Copy the environment file:
   ```bash
   cp env.example .env
   ```
3. Update the `.env` file with your desired configuration
4. Start the services:
   ```bash
   docker-compose up -d
   ```

The server will be available at `http://localhost:3000`

### Manual Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your database credentials and API key.

3. Start PostgreSQL database (if not using Docker)

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. Build and start the server:

   ```bash
   npm run build
   npm start
   ```

   Or for development:

   ```bash
   npm run dev
   ```

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` to access the Swagger UI documentation.

## Usage

### Authentication

All API endpoints require an `X-API-Key` header with a valid API key. The API key is configured via the `API_KEY` environment variable.

### Register an Endpoint

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key-here" \
  -d '{
    "url": "/api/users",
    "data": {
      "users": [
        {"id": 1, "name": "John Doe", "email": "john@example.com"},
        {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
      ]
    }
  }'
```

### Access the Mock Endpoint

```bash
curl http://localhost:3000/api/users \
  -H "X-API-Key: your-secret-api-key-here"
```

### Get Mock Data by URL

```bash
curl http://localhost:3000/api/get/api/users \
  -H "X-API-Key: your-secret-api-key-here"
```

### List All Endpoints

```bash
curl http://localhost:3000/api/endpoints \
  -H "X-API-Key: your-secret-api-key-here"
```

### Delete an Endpoint

```bash
curl -X DELETE http://localhost:3000/api/endpoints/api/users \
  -H "X-API-Key: your-secret-api-key-here"
```

## Environment Variables

| Variable      | Description                | Default                    |
| ------------- | -------------------------- | -------------------------- |
| `DB_HOST`     | PostgreSQL host            | `localhost`                |
| `DB_PORT`     | PostgreSQL port            | `5432`                     |
| `DB_NAME`     | Database name              | `mock_server_db`           |
| `DB_USER`     | Database username          | `postgres`                 |
| `DB_PASSWORD` | Database password          | `password`                 |
| `API_KEY`     | API key for authentication | `your-secret-api-key-here` |
| `PORT`        | Server port                | `3000`                     |
| `NODE_ENV`    | Environment                | `development`              |

## Database Schema

### Endpoints Table

| Column      | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| `id`        | INTEGER | Primary key, auto-increment           |
| `url`       | STRING  | Unique URL path for the endpoint      |
| `data`      | JSONB   | JSON data to return for this endpoint |
| `createdAt` | DATE    | Creation timestamp                    |
| `updatedAt` | DATE    | Last update timestamp                 |

## API Endpoints

### Authentication Required

All endpoints except `/health` and `/api-docs` require the `X-API-Key` header.

### Core Endpoints

- `POST /api/register` - Register or update a mock endpoint
- `GET /api/endpoints` - List all registered endpoints
- `GET /api/get/{url}` - Get mock data by URL path
- `DELETE /api/endpoints/{url}` - Delete a specific endpoint
- `GET /health` - Health check (no authentication required)
- `GET /api-docs` - Swagger UI documentation (no authentication required)

### Dynamic Endpoints

Any registered endpoint can be accessed via GET request:

- `GET {registered_url}` - Returns the mock data for that endpoint

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

### Project Structure

```
src/
├── config/
│   ├── database.ts      # Database configuration
│   ├── database.js      # Sequelize CLI configuration
│   └── swagger.ts       # Swagger documentation setup
├── middleware/
│   └── auth.ts          # API key authentication middleware
├── migrations/
│   └── 20231201000000-create-endpoints.js
├── models/
│   └── Endpoint.ts      # Sequelize model
├── routes/
│   └── index.ts         # API routes
├── types/
│   └── index.ts         # TypeScript type definitions
└── server.ts            # Main server file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
