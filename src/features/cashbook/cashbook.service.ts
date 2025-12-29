import { Prisma, Cashbook, PrismaClient, CashType } from "@prisma/client";
import { BaseService } from "../base/base.service";
import CashbookRepository from "./cashbook.repository"
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient()

class CashbookService extends BaseService<Cashbook, Prisma.CashbookCreateInput, Prisma.CashbookUpdateInput> {
    constructor() {
        super(CashbookRepository)
    }

    async create(data: Prisma.CashbookCreateInput): Promise<Cashbook> {
        const lastEntry = await this.repository.findLast();
        const previousBalance = lastEntry ? Number(lastEntry.balance) : 0;

        const signedAmount = data.type === CashType.IN
            ? Number(data.amount)
            : -Number(data.amount);

        const newBalance = previousBalance + signedAmount;

        console.log("data", data)

        return await this.repository.create({
            ...data,
            balance: new Prisma.Decimal(newBalance),
        });
    }

    async getAll(): Promise<Cashbook[]> {
        return await this.repository.findAll({
            include: {
                member: true,
                user: true
            }
        });
    }


}

export default new CashbookService()