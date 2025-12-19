import { TenorOption, Prisma, PrismaClient } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import TenorOptionService from "./tenorOption.service";
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import ResponseBuilder from "../../utils/ResponseBuilder";

const prisma = new PrismaClient()

class TenorOptionController extends BaseController<TenorOption, Prisma.TenorOptionCreateInput, Prisma.TenorOptionUpdateInput> {
    constructor() {
        super(TenorOptionService, "TenorOption")
    }

    async search(req: Request, res: Response) {
        const { amount } = req.query;
        if (!amount || typeof amount !== 'string') {
            return res.status(400).json(new AppError("Query parameter 'amount' is required.", 400))
        }

        const parsedAmount = Number(amount);
        if (Number.isNaN(parsedAmount)) {
            return res.status(400).json(new AppError("Query parameter 'amount' must be a valid number.", 400))
        }

        const results = await TenorOptionService.findAll({
            where: {
                amount: {
                    equals: parsedAmount
                }
            }
        });

        res.json(ResponseBuilder.success(results));
    }

}

export default new TenorOptionController()