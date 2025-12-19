import { PrismaClient, Prisma, SHUConfig } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class SHUConfigRepository extends BaseRepository<SHUConfig, Prisma.SHUConfigCreateInput, Prisma.SHUConfigUpdateInput> {
    constructor() {
        super(prisma.sHUConfig)
    }
}

export default new SHUConfigRepository();