import { Saving, Prisma, PrismaClient, SavingType, CashType, CashModule } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import SavingService from "./saving.service";
import { Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";
import savingService from "./saving.service";
import savingRepository from "./saving.repository";
import cashbookService from "../cashbook/cashbook.service";
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient()

class SavingController extends BaseController<Saving, Prisma.SavingCreateInput, Prisma.SavingUpdateInput> {
    constructor() {
        super(SavingService, "Saving")
    }

    async findSavingByMemberId(req: Request, res: Response) {
        const { id } = req.params;
        const { type } = req.query;
        const pokok = await SavingService.findAll({
            where: {
                memberId: Number(id),
                savingType: "POKOK"
            },
            include: {
                user: true
            }
        });
        const sukarela = await SavingService.findAll({
            where: {
                memberId: Number(id),
                savingType: "SUKARELA"
            },
            include: {
                user: true
            }
        });
        const wajib = await SavingService.findAll({
            where: {
                memberId: Number(id),
                savingType: "WAJIB"
            },
            include: {
                user: true
            }
        });

        let result;
        const t = typeof type === "string" ? type.toLowerCase() : undefined;

        if (!t) {
            result = {
                simpanan_pokok: pokok,
                simpanan_sukarela: sukarela,
                simpanan_wajib: wajib,
            };
        } else if (t === "sukarela") {
            result = sukarela;
        } else if (t === "pokok") {
            result = pokok;
        } else if (t === "wajib") {
            result = wajib;
        } else {
            result = {
                simpanan_pokok: pokok,
                simpanan_sukarela: sukarela,
                simpanan_wajib: wajib,
            };
        }
        res.json(ResponseBuilder.success(result, "Sukses mendapatkan data simpanan member"));
    };

    async createSaving(req: Request, res: Response) {
        const body = req.body
        if (body.savingType == "POKOK") {
            const isHavingSimpananPokok = await SavingService.findFirst(
                {
                    where: {
                        memberId: Number(body.memberId),
                        savingType: "POKOK"
                    }
                }
            )
            if (isHavingSimpananPokok) {
                res.status(400).json(ResponseBuilder.error("Anggota ini sudah memiliki simpanan pokok", 400))
            }
        }
        const result = await prisma.$transaction(async (tx) => {
            const savedResult = await savingService.create({
                amount: Number(body.amount),
                date: body.SavingDate ? new Date(body.SavingDate) : new Date(),
                savingType: body.savingType,
                member: { connect: { id: Number(body.memberId) } },
                user: { connect: { id: Number(body.userId) } },
            });

            await cashbookService.create({
                type: CashType.IN,
                module: CashModule.SAVING,
                referenceId: savedResult.id,
                referenceType: CashModule.SAVING,
                amount: new Prisma.Decimal(body.amount),
                balance: new Prisma.Decimal(0),
                description: `Simpanan dari anggota ${body.memberId}`,
                date: body.SavingDate ? new Date(body.SavingDate) : new Date(),
                member: { connect: { id: Number(body.memberId) } }
            });

            return savedResult;
        });

        if (!result) {
            throw new AppError("Gagal menyimpan simpanan", 500);
        }

        res.json(ResponseBuilder.success(result, "Sukses membuat simpanan"),);
    }

    async getSavingSum(req: Request, res: Response) {
        const loanSum = await savingService.getSavingSum()
        res.json(ResponseBuilder.success(loanSum, "Sukses"));
    }
}

export default new SavingController()