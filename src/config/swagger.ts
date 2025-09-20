import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mock Server API",
      version: "1.0.0",
      description:
        "A dynamic mock API server that allows you to register custom endpoints and return mock data",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "API Key for authentication",
        },
      },
      schemas: {
        Endpoint: {
          type: "object",
          required: ["url", "data"],
          properties: {
            url: {
              type: "string",
              description: "The URL path for the mock endpoint",
              example: "/api/foo",
            },
            data: {
              type: "object",
              description:
                "The JSON data to return when this endpoint is called",
              example: { message: "Hello World", status: "success" },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error type",
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Operation success status",
            },
            message: {
              type: "string",
              description: "Success message",
            },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    tags: [
      {
        name: "Endpoints",
        description: "Operations related to mock endpoints",
      },
      {
        name: "Health",
        description: "Health check operations",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/server.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Mock Server API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "none",
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    })
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};
