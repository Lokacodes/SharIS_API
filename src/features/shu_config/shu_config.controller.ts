import { SHUConfig, Prisma } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import SHUConfigService from "./shu_config.service";
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import ResponseBuilder from "../../utils/ResponseBuilder";
import { includes } from "zod";
import validatePercentTotal from "../../utils/validateSHUPercentage";

class SHUConfigController extends BaseController<SHUConfig, Prisma.SHUConfigCreateInput, Prisma.SHUConfigUpdateInput> {
    constructor() {
        super(SHUConfigService, "SHUConfig")
    }

    async getAllSHUConfig(req: Request, res: Response) {
        const { tahun } = req.query
        const where: Prisma.SHUConfigWhereInput = tahun
            ? { tahun: Number(tahun) }
            : {};

        const SHUConfig = await SHUConfigService.findAll({
            where,
            include: {
                items: true
            }
        })

        res.json(
            ResponseBuilder.success(SHUConfig, "sukses dapatkan SHU")
        );
    }

    async createSHUConfig(req: Request, res: Response) {
        const { tahun, items } = req.body;

        // 1. Validate percentage total
        validatePercentTotal(items);

        // 2. Check duplicate year
        const isYearExists = await SHUConfigService.findFirst({
            where: { tahun },
        });

        if (isYearExists) {
            throw new AppError(`alokasi SHU pada tahun ${tahun} sudah pernah diatur`, 400);
        }

        // 3. Build payload
        const payload: Prisma.SHUConfigCreateInput = {
            tahun,
            items: {
                create: items.map((item: { key: string; percent: number }) => ({
                    key: item.key,
                    percent: item.percent,
                })),
            },
        };

        const result = await SHUConfigService.create(payload);

        const resultWithItems = await SHUConfigService.findFirst({
            where: { id: result.id },
            include: { items: true },
        });

        if (!resultWithItems) {
            throw new AppError("gagal buat alokasi SHU", 500);
        }

        res.json(
            ResponseBuilder.success(resultWithItems, "sukses buat alokasi SHU")
        );
    }

    async updateSHUConfig(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { items } = req.body; // 🚨 REMOVE tahun

        if (isNaN(id)) {
            throw new AppError("ID tidak valid", 400);
        }

        const currentRecord = await SHUConfigService.findFirst({
            where: { id },
        });

        if (!currentRecord) {
            throw new AppError("alokasi SHU tidak ditemukan", 404);
        }

        // Validate items (must exist)
        if (!items) {
            throw new AppError("alokasi SHU wajib diisi", 400);
        }

        validatePercentTotal(items);

        const payload: Prisma.SHUConfigUpdateInput = {
            items: {
                deleteMany: {},
                create: items.map((item: { key: string; percent: number }) => ({
                    key: item.key,
                    percent: item.percent,
                })),
            },
        };

        await SHUConfigService.update(payload, id);

        const resultWithItems = await SHUConfigService.findFirst({
            where: { id },
            include: { items: true },
        });

        res.json(
            ResponseBuilder.success(resultWithItems, "sukses update alokasi SHU")
        );
    }


}

export default new SHUConfigController()

