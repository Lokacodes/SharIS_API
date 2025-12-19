import { z } from "zod";

export const createInstallmentSchema = z.object({
    loanId: z.number("loanId wajib diisi"),
    memberId: z.number("memberId wajib diisi"),
    userId: z.number("userId wajib diisi"),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "amount harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val)),
    monthMultiplier: z.number("banyak bulan pembayaran wajib diisi"),
    date: z.iso.date("tanggal harus berupa tanggal yang valid").optional(), // optional karena default = now()
    isFromSukarela: z.boolean().optional().default(false),
});

export const updateInstallmentSchema = z.object({
    loanId: z.number().optional(),
    memberId: z.number().optional(),
    userId: z.number().optional(),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "amount harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val))
        .optional(),
    monthMultiplier: z.number().optional(),
    date: z.iso.date("tanggal harus berupa tanggal yang valid").optional(),
    isFromSukarela: z.boolean().optional(),
});
