import { Cashbook, Prisma } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import CashbookService from "./cashbook.service";
import { NextFunction, Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";
import { AppError } from "../../utils/AppError";

class CashbookController extends BaseController<Cashbook, Prisma.CashbookCreateInput, Prisma.CashbookUpdateInput> {
    constructor() {
        super(CashbookService, "Cashbook")
    }

    async InsertCashEntry(req: Request, res: Response) {

        const cashbookEntry = await CashbookService.create({
            ...req.body,
            user: { connect: { id: Number(req.body.user) } }
        });

        res.json(ResponseBuilder.success(cashbookEntry))
    }

    async getAllCash(req: Request, res: Response) {
        const allCash = await CashbookService.getAll();

        res.json(ResponseBuilder.success(allCash))
    }

    async getCashByModule(req: Request, res: Response) {
        const { module, year } = req.query

        if (!year) {
            throw new AppError("tahun SHU wajib disertakan!", 400)
        }
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        const allCash = await CashbookService.findAll(
            {
                where: {
                    module: module,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: {
                    member: true,
                    user: true
                }
            }
        );

        res.json(ResponseBuilder.success(allCash))
    }

}

export default new CashbookController()
