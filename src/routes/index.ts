import { Express } from "express";
import { Endpoint } from "../models/Endpoint";

export const registerRoutes = (app: Express): void => {
  /**
   * @swagger
   * /api/register:
   *   post:
   *     summary: Register a new mock endpoint
   *     tags: [Endpoints]
   *     security:
   *       - ApiKeyAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - url
   *               - data
   *             properties:
   *               url:
   *                 type: string
   *                 description: The URL path for the mock endpoint
   *                 example: "/api/foo"
   *               data:
   *                 type: object
   *                 description: The JSON data to return when this endpoint is called
   *                 example: {"message": "Hello World", "status": "success"}
   *     responses:
   *       200:
   *         description: Endpoint registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 endpoint:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     url:
   *                       type: string
   *                     data:
   *                       type: object
   *                     createdAt:
   *                       type: string
   *                     updatedAt:
   *                       type: string
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 message:
   *                   type: string
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  app.post("/api/register", async (req, res) => {
    try {
      const { url, data } = req.body;

      if (!url || data === undefined) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Both url and data are required",
        });
      }

      if (typeof url !== "string" || url.trim() === "") {
        return res.status(400).json({
          error: "Bad Request",
          message: "URL must be a non-empty string",
        });
      }

      if (typeof data !== "object" || data === null) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Data must be a valid JSON object",
        });
      }

      const normalizedUrl = url.startsWith("/") ? url : `/${url}`;

      const [endpoint, created] = await Endpoint.upsert({
        url: normalizedUrl,
        data: data,
      });

      res.json({
        success: true,
        message: created
          ? "Endpoint created successfully"
          : "Endpoint updated successfully",
        endpoint: {
          id: endpoint.id,
          url: endpoint.url,
          data: endpoint.data,
          createdAt: endpoint.createdAt,
          updatedAt: endpoint.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error registering endpoint:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to register endpoint",
      });
    }
    return;
  });

  /**
   * @swagger
   * /api/endpoints:
   *   get:
   *     summary: Get all registered endpoints
   *     tags: [Endpoints]
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: List of all endpoints
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 endpoints:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       url:
   *                         type: string
   *                       data:
   *                         type: object
   *                       createdAt:
   *                         type: string
   *                       updatedAt:
   *                         type: string
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  app.get("/api/endpoints", async (req, res) => {
    try {
      const endpoints = await Endpoint.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.json({
        success: true,
        endpoints: endpoints.map((endpoint) => ({
          id: endpoint.id,
          url: endpoint.url,
          data: endpoint.data,
          createdAt: endpoint.createdAt,
          updatedAt: endpoint.updatedAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching endpoints:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch endpoints",
      });
    }
    return;
  });

  /**
   * @swagger
   * /api/endpoints/{url}:
   *   delete:
   *     summary: Delete an endpoint
   *     tags: [Endpoints]
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: url
   *         required: true
   *         schema:
   *           type: string
   *         description: The URL path of the endpoint to delete
   *     responses:
   *       200:
   *         description: Endpoint deleted successfully
   *       404:
   *         description: Endpoint not found
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  app.delete("/api/endpoints/*", async (req, res) => {
    try {
      const url = (req.params as any)["0"];
      const normalizedUrl = url.startsWith("/") ? url : `/${url}`;

      const deletedCount = await Endpoint.destroy({
        where: { url: normalizedUrl },
      });

      if (deletedCount === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "Endpoint not found",
        });
      }

      res.json({
        success: true,
        message: "Endpoint deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting endpoint:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete endpoint",
      });
    }
    return;
  });

  /**
   * @swagger
   * /api/get/{url}:
   *   get:
   *     summary: Get mock data by URL
   *     tags: [Endpoints]
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: url
   *         required: true
   *         schema:
   *           type: string
   *         description: The URL path of the endpoint to get mock data from
   *         example: "/api/users"
   *     responses:
   *       200:
   *         description: Mock data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               description: The mock data stored for this endpoint
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Endpoint not found
   *       500:
   *         description: Internal server error
   */
  app.get("/api/get/*", async (req, res) => {
    try {
      const url = (req.params as any)["0"];
      const normalizedUrl = url.startsWith("/") ? url : `/${url}`;

      const endpoint = await Endpoint.findOne({
        where: { url: normalizedUrl },
      });

      if (!endpoint) {
        return res.status(404).json({
          error: "Not Found",
          message: `No mock data found for endpoint: ${normalizedUrl}`,
        });
      }

      res.json(endpoint.data);
    } catch (error) {
      console.error("Error fetching mock data:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch mock data",
      });
    }
    return;
  });

  /**
   * Dynamic route handler for registered endpoints
   * This must be the last route to catch all GET requests to registered endpoints
   */
  app.get("*", async (req, res) => {
    try {
      const url = req.path;

      const endpoint = await Endpoint.findOne({
        where: { url },
      });

      if (!endpoint) {
        return res.status(404).json({
          error: "Not Found",
          message: `No mock data found for endpoint: ${url}`,
        });
      }

      res.json(endpoint.data);
    } catch (error) {
      console.error("Error fetching mock data:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch mock data",
      });
    }
    return;
  });
};
