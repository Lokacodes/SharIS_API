import { Installment, Prisma } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import InstallmentService from "./installment.service";
import { NextFunction, Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";

class InstallmentController extends BaseController<Installment, Prisma.InstallmentCreateInput, Prisma.InstallmentUpdateInput> {
    constructor() {
        super(InstallmentService, "Installment")
    }

    async payInstallment(req: Request, res: Response) {
        const { memberId, userId, amount, isFromSukarela } = req.body;
        const installment = await InstallmentService.payInstallment(
            memberId,
            userId,
            amount,
            isFromSukarela
        );
        res.status(201).json(ResponseBuilder.success(installment, "cicilan berhasil dibayarkan"));
    }

}

export default new InstallmentController()