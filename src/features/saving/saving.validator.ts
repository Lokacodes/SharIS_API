import { z } from "zod";
import { SavingType } from "@prisma/client";

export const SavingTypeEnum = z.enum(Object.values(SavingType) as [string, ...string[]]);

export const createSavingSchema = z.object({
    memberId: z.number("memberId wajib diisi"),
    userId: z.number("userId wajib diisi"),
    amount: z
        .string("amount wajib diisi")
        .regex(/^\d+(\.\d{1,2})?$/, "amount harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val)),
    date: z.iso.date("harus berupa tanggal yang valid").optional(), // default = now() handled by DB
    savingType: SavingTypeEnum,
});

export const updateSavingSchema = z.object({
    memberId: z.number().optional(),
    userId: z.number().optional(),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "amount harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
        .transform((val) => parseFloat(val))
        .optional(),
    date: z.iso.date("harus berupa tanggal yang valid").optional(),
    savingType: SavingTypeEnum,
});
