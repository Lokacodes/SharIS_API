import { PrismaClient, Prisma, Installment } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class InstallmentRepository extends BaseRepository<Installment, Prisma.InstallmentCreateInput, Prisma.InstallmentUpdateInput> {
    constructor() {
        super(prisma.installment)
    }
}

export default new InstallmentRepository();