import { Loan, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class LoanRepository extends BaseRepository<Loan, Prisma.LoanCreateInput, Prisma.LoanUpdateInput> {
    constructor() {
        super(prisma.loan)
    }

    async getLoanSum() {
        const [paidRes, unpaidRes] = await Promise.all([
            this.model.aggregate({
                _sum: { amount: true },
                where: { status: "LUNAS" }
            }),
            this.model.aggregate({
                _sum: { amount: true },
                where: { status: "DISETUJUI" }
            })
        ])

        const paidLoan = paidRes._sum?.amount ?? 0
        const unpaidLoan = unpaidRes._sum?.amount ?? 0

        return { paidLoan, unpaidLoan }
    }
}

export default new LoanRepository();