import { CashModule, CashReferenceType, CashType, Installment, Prisma } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import InstallmentService from "./installment.service";
import loanService from "../loan/loan.service";
import { NextFunction, Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";
import cashbookService from "../cashbook/cashbook.service";
import { AppError } from "../../utils/AppError";
import { calculateInstallmentBreakdown } from "../../utils/CalculateMonthlyInstallment";


class InstallmentController extends BaseController<Installment, Prisma.InstallmentCreateInput, Prisma.InstallmentUpdateInput> {
    constructor() {
        super(InstallmentService, "Installment")
    }

    async payInstallment(req: Request, res: Response) {
        const { memberId, userId, monthMultiplier, isFromSukarela } = req.body;

        const activeLoan = await loanService.findFirst({
            where: {
                memberId,
                status: "DISETUJUI",
            },
            include: {
                tenorOption: true
            }
        });

        const InstallmentBreakdown = calculateInstallmentBreakdown(Number(activeLoan.amount), Number(activeLoan.tenorOption.tenor), Number(activeLoan.tenorOption.servicePercentage))

        console.log("installment breakky", InstallmentBreakdown)

        const installment = await InstallmentService.payInstallment(
            memberId,
            userId,
            InstallmentBreakdown.principalPerMonth * monthMultiplier,
            isFromSukarela
        );

        const cashbookEntryPrincipal = await cashbookService.create({
            type: CashType.IN,
            module: CashModule.INSTALLMENT,
            referenceId: installment.installment.id,
            referenceType: CashReferenceType.INSTALLMENT,
            amount: new Prisma.Decimal(InstallmentBreakdown.principalPerMonth * monthMultiplier),
            balance: new Prisma.Decimal(0),
            description: `Angsuran pokok pinjaman anggota ${installment.installment.memberId}`,
            date: new Date(installment.installment.date),
            member: { connect: { id: Number(installment.installment.memberId) } }
        });

        const cashbookEntryService = await cashbookService.create({
            type: CashType.IN,
            module: CashModule.INCOME,
            referenceId: installment.installment.id,
            referenceType: CashReferenceType.INSTALLMENT,
            amount: new Prisma.Decimal(InstallmentBreakdown.marginPerMonth * monthMultiplier),
            balance: new Prisma.Decimal(0),
            description: `Jasa pinjaman dari anggota ${installment.installment.memberId}`,
            date: new Date(installment.installment.date),
            member: { connect: { id: Number(installment.installment.memberId) } }
        });

        if (!cashbookEntryPrincipal && !cashbookEntryService) {
            throw new AppError("Failed to create cashbook entry", 500);
        }

        res.status(201).json(ResponseBuilder.success(installment, "cicilan berhasil dibayarkan"));
    }

}

export default new InstallmentController()