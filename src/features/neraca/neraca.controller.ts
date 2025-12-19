import { Request, Response } from "express";
import NeracaService from "./neraca.service";

class NeracaController {
    async getNeraca(req: Request, res: Response) {
        try {
            const tahun = Number(req.query.tahun);

            if (!tahun) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter tahun wajib diisi",
                });
            }

            const data = await NeracaService.getNeraca(tahun);

            res.json({
                success: true,
                message: "Sukses mendapatkan neraca",
                data,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Gagal mendapatkan neraca",
            });
        }
    }
}

export default new NeracaController();
