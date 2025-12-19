import { z } from "zod";

export const createLoanOptionSchema = z.object({
    amount: z.preprocess((val) => {
        if (typeof val === "string") return val.trim() === "" ? NaN : Number(val);
        return val;
    }, z.number().int().min(0, "amount harus berupa bilangan bulat tidak negatif")),
});

export const updateLoanOptionSchema = z.object({
    amount: z.preprocess((val) => {
        if (typeof val === "string") return val.trim() === "" ? NaN : Number(val);
        return val;
    }, z.number().int().min(0, "amount harus berupa bilangan bulat tidak negatif")).optional(),
});
