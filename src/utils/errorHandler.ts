// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "./AppError";
import ResponseBuilder from "./ResponseBuilder";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ZodError) {
        return res.status(400).
            json(
                ResponseBuilder.error(
                    "data tidak sesuai",
                    400,
                    err.issues.map(e => (
                        {
                            path: e.path.join("."),
                            message: e.message,
                        }
                    ))
                )
            )
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        let statusCode = 400;
        let message = "Database error";

        switch (err.code) {
            case "P2002": // Unique constraint failed
                statusCode = 409;
                message = "Duplicate value error";
                break;
            case "P2003": // Foreign key constraint failed
                statusCode = 400;
                message = "Invalid reference";
                break;
            case "P2025": // Record not found
                statusCode = 404;
                message = "Record not found";
                break;
        }

        return res.status(statusCode).json(
            ResponseBuilder.error(
                message,
                statusCode,
                {
                    code: err.code,
                    meta: err.meta
                }
            )
        );
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json(
            ResponseBuilder.error(err.message, err.statusCode)
        )
    }

    res.status(500).json(ResponseBuilder.error("internal server error", 500));
}
