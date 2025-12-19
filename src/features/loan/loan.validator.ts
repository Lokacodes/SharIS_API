import { z } from "zod";

export const LoanStatusEnum = z.enum(["DIAJUKAN", "DISETUJUI", "DITOLAK", "LUNAS"]);

export const createLoanSchema = z.object({
    memberId: z.number("memberId wajib diisi"),
    userId: z.number("userId wajib diisi"),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "jumlah pinjaman harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val)),
    LoanDate: z
        .iso.date("harus berupa tanggal yang valid")
        .optional(), // optional karena default = now()
    Deadline: z
        .iso.date("Deadline harus berupa tanggal yang valid"),
    TenorOption: z.number("opsi tenor wajib diisi"),
    status: LoanStatusEnum.optional().default("DIAJUKAN"),
});

export const updateLoanSchema = z.object({
    memberId: z.number().optional(),
    userId: z.number().optional(),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "amount harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val))
        .optional(),
    LoanDate: z.iso.date("harus berupa tanggal yang valid").optional(),
    Deadline: z.iso.date("Deadline harus berupa tanggal yang valid").optional(),
    TenorOption: z.number().optional(),
    status: LoanStatusEnum.optional(),
});
