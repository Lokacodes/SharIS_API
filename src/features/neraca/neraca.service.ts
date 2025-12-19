import {
    PrismaClient,
    CashType,
    CashModule,
    SavingType,
    LoanStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

class NeracaService {
    async getNeraca(tahun: number) {
        const endDate = new Date(`${tahun}-12-31T23:59:59.999Z`);

        /* =========================
           AKTIVA
        ========================= */

        // 1. Kas (SALDO sampai akhir tahun)
        const kasIn = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                type: CashType.IN,
                date: { lte: endDate },
            },
        });

        const kasOut = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                type: CashType.OUT,
                date: { lte: endDate },
            },
        });

        const kas =
            Number(kasIn._sum.amount ?? 0) -
            Number(kasOut._sum.amount ?? 0);

        // 2. Piutang SP (pokok tersisa)
        const totalLoan = await prisma.loan.aggregate({
            _sum: { amount: true },
            where: {
                status: { in: [LoanStatus.DISETUJUI, LoanStatus.LUNAS] },
                LoanDate: { lte: endDate },
            },
        });

        const pokokTerbayar = await prisma.installment.aggregate({
            _sum: { amount: true },
            where: {
                date: { lte: endDate },
                isFromSukarela: false,
            },
        });

        const piutang =
            Number(totalLoan._sum.amount ?? 0) -
            Number(pokokTerbayar._sum.amount ?? 0);

        const totalAktiva = kas + piutang;

        /* =========================
           PASIVA
        ========================= */

        // 1. Hutang Lancar → Simpanan Sukarela
        const simpananSukarela = await prisma.saving.aggregate({
            _sum: { amount: true },
            where: {
                savingType: SavingType.SUKARELA,
                date: { lte: endDate },
            },
        });

        const hutangLancar = Number(
            simpananSukarela._sum.amount ?? 0
        );

        // 2. Equity

        // Simpanan Pokok
        const simpananPokok = await prisma.saving.aggregate({
            _sum: { amount: true },
            where: {
                savingType: SavingType.POKOK,
                date: { lte: endDate },
            },
        });

        // Simpanan Wajib
        const simpananWajib = await prisma.saving.aggregate({
            _sum: { amount: true },
            where: {
                savingType: SavingType.WAJIB,
                date: { lte: endDate },
            },
        });

        // SHU AKUMULATIF (bukan hanya tahun berjalan)
        const pendapatan = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                type: CashType.IN,
                module: CashModule.INCOME,
                date: { lte: endDate },
            },
        });

        const biaya = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                type: CashType.OUT,
                module: CashModule.EXPENSE,
                date: { lte: endDate },
            },
        });

        const shu =
            Number(pendapatan._sum.amount ?? 0) -
            Number(biaya._sum.amount ?? 0);

        // MODAL (dari cashbook)
        const modal = await prisma.cashbook.aggregate({
            _sum: { amount: true },
            where: {
                module: CashModule.MODAL,
                type: CashType.IN,
                date: { lte: endDate },
            },
        });


        const equity =
            Number(modal._sum.amount ?? 0) +
            Number(simpananPokok._sum.amount ?? 0) +
            Number(simpananWajib._sum.amount ?? 0) +
            shu;

        const totalPasiva = hutangLancar + equity;

        return {
            tahun,
            aktiva: {
                kas,
                piutang,
                totalAktiva,
            },
            pasiva: {
                hutangLancar,
                equity,
                totalPasiva,
            },
            balanceCheck: totalAktiva === totalPasiva,
        };
    }
}

export default new NeracaService();
