import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";
import { AuthenticationError } from "@/core/errors/AppError";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthenticationError("No token provided"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError("Invalid or expired token"));
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};
