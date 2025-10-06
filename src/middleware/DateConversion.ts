import { Request, Response, NextFunction } from "express";
import { convertDateToIso } from "../utils/Utils";

export function convertDateFields(fields: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const field of fields) {
            if (req.body[field]) {
                req.body[field] = convertDateToIso(req.body[field]);
            }
        }
        next();
    };
}
