import { CashModule, CashType, Loan, Prisma, PrismaClient } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import LoanService from "./loan.service";
import { Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";
import { AppError } from "../../utils/AppError";
import loanService from "./loan.service";
import cashbookService from "../cashbook/cashbook.service";
import { log } from "console";

const prisma = new PrismaClient()

class LoanController extends BaseController<Loan, Prisma.LoanCreateInput, Prisma.LoanUpdateInput> {
    constructor() {
        super(LoanService, "Loan")
    }

    async findLoanByMemberId(req: Request, res: Response) {
        const { id } = req.params;
        const result = await LoanService.findFirst({
            where: {
                memberId: Number(id),
                status: "DISETUJUI"
            },
            include: {
                installment: {
                },
                tenorOption: true
            }
        });
        res.json(ResponseBuilder.success(result, "Sukses mendapatkan data member"));
    };

    async findLoanById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await LoanService.findFirst({
            where: {
                id: Number(id),
            },
            include: {
                installment: {},
                member: {},
                user: {},
                tenorOption: true
            }
        });
        res.json(ResponseBuilder.success(result, "Sukses mendapatkan data member"));
    };

    async getLoan(req: Request, res: Response) {
        const result = await LoanService.findAll({
            include: {
                user: true,
                member: true,
                tenorOption: true
            }
        });
        res.json(ResponseBuilder.success(result, "Sukses mendapatkan data member"));
    };



    async createLoan(req: Request, res: Response) {
        const { memberId, userId, amount, Deadline, LoanDate, TenorOption } = req.body;

        const isMemberExist = await prisma.member.findFirst({
            where: {
                id: Number(memberId)
            }
        })

        if (!isMemberExist) {
            throw new AppError("Anggota tidak ditemukan", 404);
        }

        const existingLoan = await prisma.loan.findFirst({
            where: {
                memberId: Number(memberId),
                NOT: { status: { in: ["DITOLAK", "LUNAS"] } }
            },
        });

        if (existingLoan) {
            throw new AppError("Anggota ini masih memiliki pinjaman yang belum lunas atau belum disetujui", 400);
        }

        const existingTenorOpt = await prisma.tenorOption.findFirst({
            where: {
                id: { equals: Number(TenorOption) }
            }
        })

        if (!existingTenorOpt) {
            throw new AppError("opsi tenor tidak ditemukan", 400);
        }

        const result = await prisma.$transaction(async (tx) => {

            const loan = await tx.loan.create({
                data: {
                    amount: Number(amount),
                    Deadline: new Date(Deadline),
                    LoanDate: new Date(LoanDate),
                    member: { connect: { id: Number(memberId) } },
                    user: { connect: { id: Number(userId) } },
                    tenorOption: { connect: { id: Number(TenorOption) } }
                },
            });



            return loan;
        });

        if (!result) {
            throw new AppError("Gagal menyimpan simpanan", 500);
        }

        res.json(ResponseBuilder.success(result, "Sukses mengajukan pinjaman"));
    }

    async approveLoan(req: Request, res: Response) {
        const { id } = req.params;

        const result = await loanService.approveLoan(Number(id));

        res.json(
            ResponseBuilder.success(result, "Pinjaman berhasil disetujui")
        );
    }


    async getLoanSum(req: Request, res: Response) {
        const loanSum = await loanService.getLoanSum()
        res.json(ResponseBuilder.success(loanSum, "Sukses"));
    }

}

export default new LoanController()