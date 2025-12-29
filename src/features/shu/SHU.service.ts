import { Prisma, Cashbook, PrismaClient, CashType, CashModule, CashReferenceType } from "@prisma/client";
import { BaseService } from "../base/base.service";
import CashbookRepository from "../cashbook/cashbook.repository"
import validateMandatoryAlloc from "../../utils/ValidateHasMandatoryAlloc";
import { AppError } from "../../utils/AppError";
const prisma = new PrismaClient()

class SHUService extends BaseService<Cashbook, Prisma.CashbookCreateInput, Prisma.CashbookUpdateInput> {
    constructor() {
        super(CashbookRepository)
    }

    async getSHU(tahun: number) {
        const startDate = new Date(`${tahun}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${tahun}-12-31T23:59:59.999Z`);

        // 1. Pendapatan dari installment (margin)
        const pendapatanRes = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                type: CashType.IN,
                module: CashModule.INCOME,
                referenceType: CashReferenceType.INSTALLMENT,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const totalPendapatan = Number(pendapatanRes._sum.amount ?? 0);

        // 2. Biaya operasional
        const biayaRes = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                type: CashType.OUT,
                module: CashModule.EXPENSE,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const totalBiaya = Number(biayaRes._sum.amount ?? 0);

        // 3. SHU
        const shu = totalPendapatan - totalBiaya;

        return {
            tahun,
            pendapatan: totalPendapatan,
            biaya: totalBiaya,
            shu,
        };
    }

    async getSHUAllocation(tahun: number) {
        const { shu, pendapatan, biaya } = await this.getSHU(tahun);

        const config = await prisma.sHUConfig.findFirst({
            where: { tahun },
            include: { items: true },
        });

        if (!config) {
            throw new AppError(`SHU Config untuk tahun ${tahun} belum diatur`, 400);
        }

        const allocations = config.items.map((item) => {
            const percent = Number(item.percent);
            const amount = (shu * percent) / 100;

            return {
                key: item.key,
                percent,
                amount,
            };
        });

        if (!validateMandatoryAlloc(allocations)) {
            throw new AppError("Belum ada alokasi SHU untuk simpanan dan pinjaman", 400);
        }

        // 4. Optional: sanity check (total allocation == SHU)
        const totalAllocated = allocations.reduce(
            (sum, a) => sum + a.amount,
            0
        );

        return {
            tahun,
            pendapatan,
            biaya,
            shu,
            totalAllocated,
            allocations,
        };
    }

    async getSHUPerMember(tahun: number) {
        // 1. Get SHU & allocation
        const { shu, allocations } = await this.getSHUAllocation(tahun);

        const jasaModalAlloc = allocations.find(a => a.key === "simpanan");
        const jasaUsahaAlloc = allocations.find(a => a.key === "pinjaman");

        console.log("alokasi", allocations)

        const jasaModalTotal = jasaModalAlloc?.amount ?? 0;
        const jasaUsahaTotal = jasaUsahaAlloc?.amount ?? 0;

        // 2. TOTAL MODAL (all members)
        const totalModalRes = await prisma.saving.aggregate({
            _sum: { amount: true },
        });
        const totalModal = Number(totalModalRes._sum.amount ?? 0);

        // 3. TOTAL USAHA (all members, from installment margin)
        const totalUsahaRes = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                type: CashType.IN,
                module: CashModule.INCOME,
                referenceType: CashReferenceType.INSTALLMENT,
            },
        });
        const totalUsaha = Number(totalUsahaRes._sum.amount ?? 0);

        // 4. Per-member modal
        const modalPerMember = await prisma.saving.groupBy({
            by: ["memberId"],
            _sum: { amount: true },
        });

        // 5. Per-member usaha
        const usahaPerMember = await prisma.cashbook.groupBy({
            by: ["memberId"],
            _sum: { amount: true },
            where: {
                type: CashType.IN,
                module: CashModule.INCOME,
                referenceType: CashReferenceType.INSTALLMENT,
                memberId: { not: null }
            },
        });

        // 6. Merge per member
        const memberMap = new Map<number, any>();

        modalPerMember.forEach(m => {
            memberMap.set(m.memberId, {
                memberId: m.memberId,
                modal: Number(m._sum.amount ?? 0),
                usaha: 0,
            });
        });

        usahaPerMember.forEach(u => {
            if (!u.memberId) return;
            const existing = memberMap.get(u.memberId) || {
                memberId: u.memberId,
                modal: 0,
                usaha: 0,
            };

            existing.usaha = Number(u._sum.amount ?? 0);
            memberMap.set(u.memberId, existing);
        });

        // 7. Calculate SHU per member
        const members = Array.from(memberMap.values()).map(m => {
            const jasaModal =
                totalModal > 0
                    ? (m.modal / totalModal) * jasaModalTotal
                    : 0;

            const jasaUsaha =
                totalUsaha > 0
                    ? (m.usaha / totalUsaha) * jasaUsahaTotal
                    : 0;

            return {
                memberId: m.memberId,
                modal: m.modal,
                usaha: m.usaha,
                jasaModal,
                jasaUsaha,
                totalSHU: jasaModal + jasaUsaha,
            };
        });

        return {
            tahun,
            shuTotal: shu,
            jasaModalTotal,
            jasaUsahaTotal,
            members,
        };
    }


}

export default new SHUService()