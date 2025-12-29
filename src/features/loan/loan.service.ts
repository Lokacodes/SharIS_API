import { Prisma, Loan, PrismaClient } from "@prisma/client";
import { BaseService } from "../base/base.service";
import loanRepository from "../loan/loan.repository"
import cashbookService from "../cashbook/cashbook.service";
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient()

class LoanService extends BaseService<Loan, Prisma.LoanCreateInput, Prisma.LoanUpdateInput> {
    constructor() {
        super(loanRepository)
    }

    async createLoan(data: Prisma.LoanCreateInput) {
        const memberId = data.member.connect?.id; // depending on how you pass relation

        if (!memberId) {
            throw new Error("memberId harus disertakan.");
        }

        const existingLoans = await this.repository.findAll({
            where: {
                memberId: memberId,
                status: {
                    notIn: ["DITOLAK", "LUNAS"], // only allow if all others are these
                },
            },
        });

        if (existingLoans.length > 0) {
            throw new Error("Anggota masih memiliki pinjaman yang belum lunas atau belum ditolak.");
        }

        // ✅ create new loan
        return this.repository.create({
            ...data,
            status: "DIAJUKAN", // default status for new loan
        });
    }

    async getLoanSum() {
        const result = await loanRepository.getLoanSum()
        return result
    }

    async approveLoan(loanId: number) {
        return prisma.$transaction(async (tx) => {
            const loan = await tx.loan.findUnique({
                where: { id: loanId },
            });

            if (!loan) {
                throw new AppError("Loan tidak ditemukan");
            }

            if (loan.status !== "DIAJUKAN") {
                throw new AppError("Loan tidak bisa disetujui");
            }

            // 1️⃣ Hitung kas saat ini
            const kasIn = await tx.cashbook.aggregate({
                _sum: { amount: true },
                where: { type: "IN" },
            });

            const kasOut = await tx.cashbook.aggregate({
                _sum: { amount: true },
                where: { type: "OUT" },
            });

            const kas =
                Number(kasIn._sum.amount ?? 0) -
                Number(kasOut._sum.amount ?? 0);

            // 2️⃣ Validasi kas
            if (kas < Number(loan.amount)) {
                throw new AppError("Kas tidak mencukupi untuk mencairkan pinjaman");
            }

            // 3️⃣ Update status loan
            const approvedLoan = await tx.loan.update({
                where: { id: loanId },
                data: { status: "DISETUJUI" },
            });

            await cashbookService.create({
                type: "OUT",
                module: "LOAN",
                referenceId: loan.id,
                referenceType: "LOAN",
                amount: new Prisma.Decimal(loan.amount),
                balance: new Prisma.Decimal(0),
                description: `Pencairan pinjaman loan #${loan.id}`,
                date: new Date(),
                member: { connect: { id: Number(loan.memberId) } },
                user: { connect: { id: Number(loan.userId) } }
            });

            return approvedLoan;
        });
    }


}

export default new LoanService()