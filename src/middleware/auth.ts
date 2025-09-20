import { Request, Response, NextFunction } from "express";

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.header("X-API-Key");
  const validApiKey = process.env.API_KEY;

  if (!apiKey || !validApiKey) {
    res.status(401).json({
      error: "Unauthorized",
      message: "X-API-Key header is required",
    });
    return;
  }

  if (apiKey !== validApiKey) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid API Key",
    });
    return;
  }

  next();
};
