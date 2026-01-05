import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../types/auth";

export const authorize = (roles: string[]) => {
    return (
        req: Request & { auth?: AuthPayload },
        res: Response,
        next: NextFunction
    ) => {
        if (!req.auth || !roles.includes(req.auth.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
