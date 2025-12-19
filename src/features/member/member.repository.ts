import { PrismaClient, Member, Prisma } from "@prisma/client";
import { BaseRepository } from "../base/base.repository";
import { includes } from "zod";

const prisma = new PrismaClient()

class MemberRepository extends BaseRepository<Member, Prisma.MemberCreateInput, Prisma.MemberUpdateInput> {
    constructor() {
        super(prisma.member)
    }

    async searchByName(name: string) {
        return this.model.findMany({
            where: {
                name: {
                    contains: name,
                }
            }
        });
    }

    async getMemberWithLoansById(id: number) {
        return this.model.findUnique({
            where: { id },
            include: {
                loan: {
                    include: {
                        installment: true
                    }
                }
            }
        });
    }
}

export default new MemberRepository();