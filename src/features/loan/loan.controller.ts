import { Loan, Prisma, PrismaClient } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import LoanService from "./loan.service";
import { Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient()

class LoanController extends BaseController<Loan, Prisma.LoanCreateInput, Prisma.LoanUpdateInput> {
    constructor() {
        super(LoanService, "Loan")
    }

    async findLoanByMemberId(req: Request, res: Response) {
        const { id } = req.params;
        const result = await LoanService.findAll({
            where: { memberId: Number(id) },
        });
        res.json(ResponseBuilder.success(result, "Sukses mendapatkan data member"));
    };

    async createLoan(req: Request, res: Response) {
        const { memberId, userId, amount, Deadline, LoanDate } = req.body;

        const existingLoan = await prisma.loan.findFirst({
            where: {
                memberId: Number(memberId),
                NOT: { status: { in: ['DITOLAK', 'LUNAS'] } },
            },
        });

        if (existingLoan) {
            throw new AppError("Anggota ini masih memiliki pinjaman yang belum lunas atau belum disetujui", 400)
        }

        const loan = await prisma.loan.create({
            data: {
                amount: Number(amount),
                Deadline: new Date(Deadline),
                LoanDate: new Date(LoanDate),
                member: { connect: { id: Number(memberId) } },
                user: { connect: { id: Number(userId) } },
            },
        });
        res.json(ResponseBuilder.success(loan, "Sukses mengajukan pinjaman"));
    }

}

export default new LoanController()