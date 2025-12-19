import { Prisma, Saving } from "@prisma/client";
import { BaseService } from "../base/base.service";
import SavingRepository from "./saving.repository"
import { AppError } from "../../utils/AppError";

class SavingService extends BaseService<Saving, Prisma.SavingCreateInput, Prisma.SavingUpdateInput> {
    constructor() {
        super(SavingRepository)
    }

    async createSaving(data: Prisma.SavingCreateInput) {
        const memberId = data.member.connect?.id;

        if (!memberId) {
            throw new AppError("memberId harus disertakan.", 402);
        }

        const existingSavings = await this.repository.findAll({
            where: {
                memberId: memberId,
            },
        });

        if (!existingSavings) {
            throw new AppError("Anggota belum mempunyai simpanan", 404)
        }

        return this.repository.create({
            ...data,
        });
    }

    async getSavingSum() {
        const result = await SavingRepository.getSavingSum()
        return result
    }

}

export default new SavingService()