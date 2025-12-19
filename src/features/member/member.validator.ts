import * as z from "zod"

const CreateMemberValidation = z.object({
    name: z.string("Nama wajib diisi").min(3, "Nama minimal mengandung 3 karakter").max(60, "Nama maksimal mengandung 60 karakter"),
    dateOfBirth: z.iso.date("Format tanggal tidak sesuai! gunakan format yyyy-mm-dd"),
    address: z.string("Alamat wajib diisi").max(100, "Alamat terlalu panjang!"),
    phone: z.string("Nomor telepon wajib diisi").regex(/^(08|62)[0-9]{8,11}$/, "Nomor telepon tidak valid").max(13, "Nomor telepon terlalu panjang")
})

const UpdateMemberValidation = z.object({
    name: z.string("Nama wajib diisi").min(3, "Nama minimal mengandung 3 karakter").max(60, "Nama maksimal mengandung 60 karakter").optional(),
    dateOfBirth: z.iso.date("Format tanggal tidak sesuai! gunakan format yyyy-mm-dd").optional(),
    address: z.string("Alamat wajib diisi").max(100, "Alamat terlalu panjang!").optional(),
    phone: z.string("Nomor telepon wajib diisi").regex(/^08[0-9]{8,11}$/, "Nomor telepon tidak valid").max(13, "Nomor telepon terlalu panjang").optional()
})

export { CreateMemberValidation, UpdateMemberValidation }