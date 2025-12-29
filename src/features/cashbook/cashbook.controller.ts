import { Cashbook, Prisma } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import CashbookService from "./cashbook.service";
import { NextFunction, Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";

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
        const { module } = req.query
        const allCash = await CashbookService.findAll(
            {
                where: {
                    module: module
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
