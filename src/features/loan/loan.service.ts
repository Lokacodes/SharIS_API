import { Prisma, Loan } from "@prisma/client";
import { BaseService } from "../base/base.service";
import loanRepository from "../loan/loan.repository"

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

}

export default new LoanService()