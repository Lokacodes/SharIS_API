import { z } from "zod";

export const CashType = z.enum(["IN", "OUT"]);
export const CashModule = z.enum(["SAVING", "LOAN", "INSTALLMENT", "INCOME", "EXPENSE", "MODAL"]);
export const RefType = z.enum(["SAVING", "LOAN", "INSTALLMENT"]);

export const createCashbookSchema = z.object({
    type: CashType,
    module: CashModule,
    referenceId: z.number().nullable().optional(),
    referenceType: RefType
        .nullable()
        .optional(),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "amount harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val)),
    date: z.iso.date("harus berupa tanggal yang valid").optional(),
    description: z.string().min(1, "deskripsi wajib diisi"),
    member: z.number().optional(),
    user: z.number("anggota wajib diisi")
});

export const updateCashbookSchema = z.object({
    type: CashType.optional(),
    module: CashModule.optional(),
    referenceId: z.number().nullable().optional(),
    referenceType: RefType.nullable().optional(),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "amount harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val))
        .optional(),
    date: z.iso.date("harus berupa tanggal yang valid").optional(),
    description: z.string().optional(),
    member: z.number().optional(),
    user: z.number().optional(),
});
