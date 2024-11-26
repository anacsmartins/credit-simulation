import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar os erros de validação em requisições.
 * Responde com status 400 e uma lista de erros caso haja validações falhas.
 */

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
