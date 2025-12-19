import { PrismaClient, Prisma, Cashbook } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class CashbookRepository extends BaseRepository<Cashbook, Prisma.CashbookCreateInput, Prisma.CashbookUpdateInput> {
    constructor() {
        super(prisma.cashbook)
    }
}

export default new CashbookRepository();