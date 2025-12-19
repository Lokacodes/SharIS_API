import { Prisma, SHUConfig, PrismaClient, CashType } from "@prisma/client";
import { BaseService } from "../base/base.service";
import SHUConfigRepository from "./shu_config.repository"
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient()

class SHUConfigService extends BaseService<SHUConfig, Prisma.SHUConfigCreateInput, Prisma.SHUConfigUpdateInput> {
    constructor() {
        super(SHUConfigRepository)
    }
}

export default new SHUConfigService()