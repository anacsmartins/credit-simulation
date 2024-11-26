import { NextFunction, Request, Response } from "express";
/**
 * Middleware global para capturar e processar erros.
 */
export const notFoundHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction ): void => {
    console.error("Error caught by global handler:", err);
    res.status(404).json({ error: "Route not found" });
};
  