import {
    PrismaClient,
    SavingType,
    LoanStatus,
    CashType,
    CashModule,
    CashReferenceType,
    Prisma
} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const USER_ID = 8
    const TENOR_ID = 15
    const TENOR = 10
    const MARGIN_RATE = 0.10
    const TAHUN = new Date().getFullYear()

    /* =========================
       1. MODAL AWAL
    ========================= */
    await prisma.cashbook.create({
        data: {
            type: CashType.IN,
            module: CashModule.MODAL,
            userId: USER_ID,
            amount: new Prisma.Decimal(150_000_000),
            balance: new Prisma.Decimal(0),
            description: "Modal awal koperasi",
            date: new Date(`${TAHUN}-01-01`)
        }
    })

    /* =========================
       2. MEMBERS (67)
    ========================= */
    const members = []
    for (let i = 1; i <= 67; i++) {
        members.push(await prisma.member.create({
            data: {
                name: `Anggota ${i}`,
                dateOfBirth: new Date(1985 + (i % 10), i % 12, 1),
                phone: `08123${100000 + i}`,
                address: "Surabaya",
            }
        }))
    }

    /* =========================
       3. SIMPANAN
       (POKOK + WAJIB)
    ========================= */
    for (const m of members) {

        // POKOK
        const pokok = await prisma.saving.create({
            data: {
                memberId: m.id,
                userId: USER_ID,
                amount: 500_000,
                savingType: SavingType.POKOK,
                date: new Date(`${TAHUN}-01-05`)
            }
        })

        await prisma.cashbook.create({
            data: {
                type: CashType.IN,
                module: CashModule.SAVING,
                referenceId: pokok.id,
                referenceType: CashReferenceType.SAVING,
                userId: USER_ID,
                memberId: m.id,
                amount: pokok.amount,
                balance: new Prisma.Decimal(0),
                description: "Simpanan pokok",
                date: pokok.date
            }
        })

        // WAJIB
        const wajib = await prisma.saving.create({
            data: {
                memberId: m.id,
                userId: USER_ID,
                amount: 100_000,
                savingType: SavingType.WAJIB,
                date: new Date(`${TAHUN}-02-05`)
            }
        })

        await prisma.cashbook.create({
            data: {
                type: CashType.IN,
                module: CashModule.SAVING,
                referenceId: wajib.id,
                referenceType: CashReferenceType.SAVING,
                userId: USER_ID,
                memberId: m.id,
                amount: wajib.amount,
                balance: new Prisma.Decimal(0),
                description: "Simpanan wajib",
                date: wajib.date
            }
        })
    }

    /* =========================
       4. LOAN (40 MEMBER)
       1JT / 2JT
    ========================= */
    const loans = []

    for (const m of members.slice(0, 40)) {
        const amount = Math.random() < 0.5 ? 1_000_000 : 2_000_000

        const loan = await prisma.loan.create({
            data: {
                memberId: m.id,
                userId: USER_ID,
                amount,
                LoanDate: new Date(`${TAHUN}-03-01`),
                Deadline: new Date(`${TAHUN}-12-31`),
                status: LoanStatus.DISETUJUI,
                tenorOptionId: TENOR_ID
            }
        })

        loans.push(loan)

        await prisma.cashbook.create({
            data: {
                type: CashType.OUT,
                module: CashModule.LOAN,
                referenceId: loan.id,
                referenceType: CashReferenceType.LOAN,
                userId: USER_ID,
                memberId: m.id,
                amount: loan.amount,
                balance: new Prisma.Decimal(0),
                description: `Pencairan pinjaman #${loan.id}`,
                date: loan.LoanDate
            }
        })
    }

    /* =========================
       5. INSTALLMENT
       10 BULAN + MARGIN 10%
    ========================= */
    for (const loan of loans) {
        const isLunas = Math.random() < 0.6 // sebagian lunas
        const pokokPerBulan = Number(loan.amount) / TENOR
        const totalMargin = Number(loan.amount) * MARGIN_RATE
        const marginPerBulan = totalMargin / TENOR

        let totalPokokTerbayar = 0

        for (let bulan = 1; bulan <= TENOR; bulan++) {
            if (!isLunas && bulan > 5) break // belum lunas → hanya 5 bulan

            const baseDate = new Date(loan.LoanDate)
            const tanggal = new Date(
                baseDate.getFullYear(),
                baseDate.getMonth() + bulan,
                5
            )


            const inst = await prisma.installment.create({
                data: {
                    loanId: loan.id,
                    memberId: loan.memberId,
                    userId: USER_ID,
                    amount: pokokPerBulan,
                    date: tanggal,
                    isFromSukarela: false
                }
            })

            // =====================
            // POKOK
            // =====================
            await prisma.cashbook.create({
                data: {
                    type: CashType.IN,
                    module: CashModule.INSTALLMENT,
                    referenceId: inst.id,
                    referenceType: CashReferenceType.INSTALLMENT,
                    userId: USER_ID,
                    memberId: loan.memberId,
                    amount: new Prisma.Decimal(pokokPerBulan),
                    balance: new Prisma.Decimal(0),
                    description: "Angsuran pokok",
                    date: tanggal
                }
            })

            // =====================
            // MARGIN
            // =====================
            await prisma.cashbook.create({
                data: {
                    type: CashType.IN,
                    module: CashModule.INCOME,
                    referenceId: inst.id,
                    referenceType: CashReferenceType.INSTALLMENT,
                    userId: USER_ID,
                    memberId: loan.memberId,
                    amount: new Prisma.Decimal(marginPerBulan),
                    balance: new Prisma.Decimal(0),
                    description: "Margin pinjaman",
                    date: tanggal
                }
            })

            totalPokokTerbayar += pokokPerBulan
        }

        if (totalPokokTerbayar >= Number(loan.amount)) {
            await prisma.loan.update({
                where: { id: loan.id },
                data: { status: LoanStatus.LUNAS }
            })
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
