// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken, verifyRefreshToken, JwtPayload } from "../utils/JWT";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Unauthorized: No token provided", 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError("Unauthorized: Invalid token format", 401);
        }

        const decoded = verifyAccessToken(token);

        req.user = decoded;
        next();
    } catch (err) {
        throw new AppError("Unauthorized: Invalid or expired token", 401);
    }
}
