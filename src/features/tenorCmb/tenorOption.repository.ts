import { TenorOption, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class TenorOptionRepository extends BaseRepository<TenorOption, Prisma.TenorOptionCreateInput, Prisma.TenorOptionUpdateInput> {
    constructor() {
        super(prisma.tenorOption)
    }
}

export default new TenorOptionRepository();