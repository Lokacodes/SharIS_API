import { Cashbook, Prisma } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import shuService from "./SHU.service";
import { Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";
import { AppError } from "../../utils/AppError";

class CashbookController extends BaseController<Cashbook, Prisma.CashbookCreateInput, Prisma.CashbookUpdateInput> {
    constructor() {
        super(shuService, "SHU")
    }

    async getSHU(req: Request, res: Response) {
        const { tahun } = req.query

        if (!tahun) {
            throw new AppError("tahun SHU wajib disertakan!", 400)
        }
        const result = await shuService.getSHUAllocation(Number(tahun));
        res.json(ResponseBuilder.success(result, "Sukses mendapatkan perhitungan SHU"))
    }

    async getSHUMember(req: Request, res: Response) {
        const { tahun } = req.query
        const result = await shuService.getSHUPerMember(Number(tahun));
        res.json(ResponseBuilder.success(result, "sukses mendapatkan data alokasi SHU anggota"));
    }
}

export default new CashbookController()