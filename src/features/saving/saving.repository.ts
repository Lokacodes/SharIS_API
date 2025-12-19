import { Saving, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class SavingRepository extends BaseRepository<Saving, Prisma.SavingCreateInput, Prisma.SavingUpdateInput> {
    constructor() {
        super(prisma.saving)
    }

    async getSavingSum() {
        const [pokok, sukarela, wajib] = await Promise.all([
            this.model.aggregate({
                _sum: { amount: true },
                where: { savingType: "POKOK" }
            }),
            this.model.aggregate({
                _sum: { amount: true },
                where: { savingType: "SUKARELA" }
            }),
            this.model.aggregate({
                _sum: { amount: true },
                where: { savingType: "WAJIB" }
            }),
        ])

        const simpananPokok = pokok._sum?.amount ?? 0
        const simpananWajib = wajib._sum?.amount ?? 0
        const simpananSukarela = sukarela._sum?.amount ?? 0

        return { simpananPokok, simpananWajib, simpananSukarela }
    }
}

export default new SavingRepository();