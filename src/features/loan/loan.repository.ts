import { Loan, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class LoanRepository extends BaseRepository<Loan, Prisma.LoanCreateInput, Prisma.LoanUpdateInput> {
    constructor() {
        super(prisma.loan)
    }
}

export default new LoanRepository();