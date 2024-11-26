import { Request, Response, NextFunction } from "express";

/**
 * Middleware para capturar rotas não encontradas (404).
 */
export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({ error: "Route not found" });
};
