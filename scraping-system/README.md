# Scraping System

## Project Overview

The Scraping System is a Node.js-based web application that parses URLs and their sub-URLs, saving the results in a MongoDB database. The application provides an API to submit URLs for parsing, retrieve stored URLs, and delete URLs.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Avichai997/Lusha-scraping-system.git
cd scraping-system
```

## Running the Project

### Development Mode

To run the project in development mode:

1. Ensure Docker Daemon is running.

2. Start the development server using Docker Compose:

```bash
docker compose up --build
```

3. The server will be available at `http://localhost:3000`.

### Production Mode

To run the project in production mode:

1. Ensure Docker Daemon is running.

2. Start the production server using Docker Compose:

```bash
docker compose -f docker-compose.prod.yml up --build
```

3. The server will be available at `http://localhost:3000`.

### Building the Project

To build the project for production:

```bash
# Using Docker:
docker compose -f docker-compose.prod.yml up --build

# Manually:
cd scraping-system
npm install
npm run build
npm run start:prod
```

The build output will be placed in the `dist/` directory.

## Testing

The project includes both unit and integration tests, implemented using Jest.

### Running Tests

To run tests in development mode:

```bash
npm run test:dev
```

To run tests in production mode:

```bash
npm run test:prod
```

### Test Coverage

The tests cover the following functionalities:

- **Global Error Handling**: Tests ensure that different types of errors (e.g., validation errors, JWT errors) are handled correctly and return appropriate status codes and messages.
- **URL Parsing**: Tests verify that URLs can be parsed, stored, and retrieved correctly, and that sub-URLs are recursively parsed and stored.
- **API Endpoints**: Tests check that the `/api/parse` endpoint works as expected, handling both valid and invalid input cases.
- **Health Check Endpoint**: Tests ensure that the health check endpoint correctly reports the server's health status.

### API Endpoints

Testing Endpoints Using Swagger:

1. **Start the Server**: Make sure your server is running in either development or production mode.

   - In development mode:

     ```bash
     docker compose up --build
     ```

   - In production mode:

     ```bash
     docker compose -f docker-compose.prod.yml up --build
     ```

2. **Open Swagger UI**: Once the server is running, open your browser and go to the following URL:

   http://localhost:3000/api-docs

3. **Explore the API Endpoints**: You will see a list of all available API endpoints. Each endpoint is listed with its method (GET, POST, DELETE) and a brief description.

4. **Testing Endpoints**:

   - **Select an Endpoint**: Click on an endpoint to expand its details.
   - **Fill in the Required Fields**: If the endpoint requires any parameters or body data (like a URL to parse), fill them in.
   - **Execute the Request**: Click the "Try it out" button, then "Execute" to send a request to the server.

5. **View Responses**: After executing a request, Swagger will display the server's response, including the status code, response body, and any headers.

### Example: Testing the `/api/parse` Endpoint

1. **Open the `/api/parse` POST Endpoint**: Expand the POST `/api/parse` section.
2. **Fill in the URL Field**:

- In the `url` field, enter a URL you want to parse, for example, `http://www.example.com`.

3. **Execute the Request**: Click "Try it out", then "Execute".
4. **View the Response**: Swagger will show the response from the server, indicating whether the URL was successfully parsed and stored.

Using Swagger is an easy and efficient way to test your API during development without needing to use external tools like Postman.

## Assumptions and Notes

- The project uses a mock parser (`"lusha-mock-parser"`) to simulate the URL parsing process. This can be replaced with a real parser in a production environment.
- The project includes error handling for common issues like missing URLs, invalid input, and database errors.
- The Docker configuration is set up for both development and production environments, with separate Dockerfiles and Compose files for each.

## Project Structure

The project is structured as follows:
.
├── docker-compose.prod.yml
├── docker-compose.yml
├── scraping-system
│ ├── Dockerfile
│ ├── jest.config.js
│ ├── local.Dockerfile
│ ├── nodemon.json
│ ├── package.json
│ ├── package-lock.json
│ ├── README.md
│ ├── src
│ │ ├── app.ts
│ │ ├── components
│ │ │ ├── health
│ │ │ │ └── health.router.ts
│ │ │ ├── servicesFactory.ts
│ │ │ └── url
│ │ │ ├── url.controller.ts
│ │ │ ├── url.model.ts
│ │ │ ├── url.router.ts
│ │ │ └── url.service.ts
│ │ ├── index.ts
│ │ ├── middlewares
│ │ │ └── index.ts
│ │ ├── **tests**
│ │ │ ├── globalErrorHandler.test.ts
│ │ │ ├── globalSetup.ts
│ │ │ ├── globalTeardown.ts
│ │ │ ├── health.test.ts
│ │ │ ├── jest.setup.ts
│ │ │ ├── notFound.test.ts
│ │ │ ├── url.controller.test.ts
│ │ │ └── urlParseEndpoint.test.ts
│ │ ├── types
│ │ │ ├── index.ts
│ │ │ └── lusha-mock-parser.d.ts
│ │ └── utils
│ │ ├── ApiFeatures.ts
│ │ ├── AppError.ts
│ │ ├── catchAsync.ts
│ │ ├── connectDB.ts
│ │ ├── createLogger.ts
│ │ ├── environment.ts
│ │ ├── errorHandler.ts
│ │ ├── logger.ts
│ │ └── swaggerOptions.ts
│ └── tsconfig.json
├── scraping-system.code-workspace
└── Scrapping System.png

## Conclusion

This README provides all the necessary information to run, build, test, and interact with the Scraping System project.
