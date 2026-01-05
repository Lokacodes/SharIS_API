import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/JWT";
import { AuthPayload } from "../types/auth";

export function authenticate(
    req: Request & { auth?: AuthPayload },
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.auth = decoded; // ← BUKAN req.user
    next();
}
