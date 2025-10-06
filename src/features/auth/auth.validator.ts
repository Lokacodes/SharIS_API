import * as z from "zod"

export const registerValidation = z.object({
    name: z.string("Nama wajib diisi").min(3, "Nama minimal mengandung 3 karakter").max(60, "Nama maksimal mengandung 60 karakter"),
    email: z.email("email tidak valid"),
    password: z.string("Password wajib diisi"),
    role: z.enum(
        [
            "SUPERADMIN",
            "ADMIN",
            "PENGURUS",
            "KETUA",
            "BENDAHARA",
            "SEKRETARIS"
        ], "role tidak valid").default("PENGURUS")
})

export const loginValidation = z.object({
    email: z.email("email tidak valid"),
    password: z.string("Password wajib diisi"),
})

export const updateUserValidation = z.object({
    name: z.string().min(3, "Nama minimal mengandung 3 karakter").max(60, "Nama maksimal mengandung 60 karakter").optional(),
    email: z.email("email tidak valid").optional(),
    password: z.string().optional(),
    role: z.enum([
        "SUPERADMIN",
        "ADMIN",
        "PENGURUS",
        "KETUA",
        "BENDAHARA",
        "SEKRETARIS"
    ], "role tidak valid").optional()
})