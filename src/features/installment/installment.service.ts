import { Prisma, Loan, Installment, PrismaClient } from "@prisma/client";
import { BaseService } from "../base/base.service";
import installmentRepository from "../installment/installment.repository"
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient()

class InstallmentService extends BaseService<Installment, Prisma.InstallmentCreateInput, Prisma.InstallmentUpdateInput> {
    constructor() {
        super(installmentRepository)
    }

    payInstallment = async (
        memberId: number,
        userId: number,
        amount: number,
        isFromSukarela = false
    ) => {
        const activeLoan = await prisma.loan.findFirst({
            where: {
                memberId,
                status: "DISETUJUI",
            },
        });

        if (!activeLoan) {
            throw new AppError("Tidak ada pinjaman aktif untuk member ini", 400);
        }

        const totalPaid = await prisma.installment.aggregate({
            where: { loanId: activeLoan.id },
            _sum: { amount: true },
        });

        const sudahDibayar = Number(totalPaid._sum.amount ?? 0);
        const sisaHutang = Number(activeLoan.amount) - sudahDibayar;

        if (amount > sisaHutang) {
            throw new AppError(
                `Jumlah cicilan melebihi sisa hutang. Sisa hutang: ${sisaHutang}`,
                400
            );
        }

        const installment = await this.repository.create({
            loan: { connect: { id: activeLoan.id } },
            member: { connect: { id: memberId } },
            user: { connect: { id: userId } },
            amount,
            isFromSukarela,
        });

        const totalAfterPayment = sudahDibayar + amount;

        if (totalAfterPayment >= Number(activeLoan.amount)) {
            await prisma.loan.update({
                where: { id: activeLoan.id },
                data: { status: "LUNAS" },
            });
        }

        return {
            installment,
            sudahDibayar: sudahDibayar + amount,
            sisaHutang: Math.max(sisaHutang - amount, 0),
        };
    };
}

export default new InstallmentService()