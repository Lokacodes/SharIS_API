import { PrismaClient, Member, Prisma } from "../../generated/prisma";
import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class MemberRepository extends BaseRepository<Member, Prisma.MemberCreateInput, Prisma.MemberUpdateInput> {
    constructor() {
        super(prisma.member)
    }
}

export default new MemberRepository();