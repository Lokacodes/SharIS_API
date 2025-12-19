export interface InstallmentBreakdown {
    principalPerMonth: number;      // Bagian pokok per bulan
    marginPerMonth: number;         // Bagian jasa/margin per bulan (income koperasi)
    totalPerMonth: number;          // Total angsuran per bulan
    totalMargin: number;            // Total jasa keseluruhan
    totalPayment: number;           // Total bayar keseluruhan
}

export function calculateInstallmentBreakdown(
    principal: number,
    tenor: number,
    marginPercent: number
): InstallmentBreakdown {

    if (tenor <= 0) {
        throw new Error("Tenor must be greater than 0.");
    }

    const marginDecimal = marginPercent / 100;

    // Total margin (jasa koperasi)
    const totalMargin = principal * marginDecimal;

    // Total pembayaran = pokok + margin
    const totalPayment = principal + totalMargin;

    // Bagian pokok per bulan
    const principalPerMonth = principal / tenor;

    // Bagian jasa per bulan
    const marginPerMonth = totalMargin / tenor;

    // Total angsuran per bulan
    const totalPerMonth = totalPayment / tenor;

    return {
        principalPerMonth,
        marginPerMonth,
        totalPerMonth,
        totalMargin,
        totalPayment
    };
}
