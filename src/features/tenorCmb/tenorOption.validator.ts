import { z } from "zod";

export const createTenorOptionSchema = z.object({
    tenor: z.preprocess((val) => {
        if (typeof val === "string") return val.trim() === "" ? NaN : Number(val);
        return val;
    }, z.number().int().min(0, "tenor harus berupa bilangan bulat tidak negatif")),
    name: z.string().trim().min(1, "nama tidak boleh kosong"),
    servicePercentage: z.number().int().min(0, "tenor harus berupa bilangan bulat tidak negatif")
});

export const updateTenorOptionSchema = z.object({
    tenor: z.preprocess((val) => {
        if (typeof val === "string") return val.trim() === "" ? NaN : Number(val);
        return val;
    }, z.number().int().min(0, "tenor harus berupa bilangan bulat tidak negatif")).optional(),
    name: z.string().trim().min(1, "nama tidak boleh kosong").optional(),
    servicePercentage: z.number().int().min(0, "tenor harus berupa bilangan bulat tidak negatif").optional()
}).refine((obj) => Object.keys(obj).length > 0, {
    message: "Minimal satu field harus diubah",
});
