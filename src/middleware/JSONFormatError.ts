import { Request, Response, NextFunction } from "express";

export const JSONFormatError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "format JSON tidak valid",
            details: err.message,
        });
    }
    next(err);
}