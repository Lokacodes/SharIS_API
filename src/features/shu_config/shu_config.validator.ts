import { z } from "zod";

// Reusable decimal validator to match your cashbook pattern
const decimalString = z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "harus berupa angka desimal dengan maksimal 2 digit di belakang koma")
    .transform((val) => parseFloat(val));

/**
 * SHUConfigItem validator
 */
export const shuConfigItemSchema = z.object({
    key: z.string().min(1, "nama pembagian wajib diisi"),
    percent: decimalString,
});

/**
 * Create SHUConfig
 */
export const createSHUConfigSchema = z.object({
    tahun: z
        .number("tahun wajib diisi")
        .min(1900, "tahun tidak valid")
        .max(3000, "tahun tidak valid"),

    items: z
        .array(shuConfigItemSchema)
        .min(1, "minimal harus ada satu pembagian SHU"),
});

/**
 * Update SHUConfig
 */
export const updateSHUConfigSchema = z.object({
    tahun: z.number().optional(),

    items: z.array(shuConfigItemSchema).optional(),
});
