import jwt from "jsonwebtoken";
import { AppError, AuthenticationError } from "@/core/errors/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const JWT_ISSUER = process.env.JWT_ISSUER || "ignitor-app";

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload, expiresIn: string = JWT_EXPIRES_IN): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn as any,
    issuer: JWT_ISSUER,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as any,
    issuer: JWT_ISSUER,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
    }) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("Token has expired");
    }
    throw new AuthenticationError("Invalid token");
  }
};
