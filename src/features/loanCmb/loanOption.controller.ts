import { LoanOption, Prisma, PrismaClient } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import LoanOptionService from "./loanOption.service";
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import loanOptionService from "./loanOption.service";
import ResponseBuilder from "../../utils/ResponseBuilder";

const prisma = new PrismaClient()

class LoanOptionController extends BaseController<LoanOption, Prisma.LoanOptionCreateInput, Prisma.LoanOptionUpdateInput> {
    constructor() {
        super(LoanOptionService, "LoanOption")
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

        const results = await loanOptionService.findAll({
            where: {
                amount: {
                    equals: parsedAmount
                }
            }
        });

        res.json(ResponseBuilder.success(results));
    }

}

export default new LoanOptionController()