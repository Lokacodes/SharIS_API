import { BaseService } from "../base/base.service";
import MemberRepository from "./member.repository";
import { Member, Prisma } from "@prisma/client";

class MemberService extends BaseService<Member, Prisma.MemberCreateInput, Prisma.MemberUpdateInput> {
    constructor() {
        super(MemberRepository);
    }

    async searchByName(query: string) {
        const result = MemberRepository.searchByName(query);
        return result
    }

    async getMemberWithLoansById(id: number) {
        return MemberRepository.getMemberWithLoansById(id);
    }
}

export default new MemberService();