import { LoanOption, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class LoanOptionRepository extends BaseRepository<LoanOption, Prisma.LoanOptionCreateInput, Prisma.LoanOptionUpdateInput> {
    constructor() {
        super(prisma.loanOption)
    }
}

export default new LoanOptionRepository();