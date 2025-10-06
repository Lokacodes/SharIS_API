import { BaseService } from "../base/base.service";
import MemberRepository from "./member.repository";
import { Member, Prisma } from "../../generated/prisma";

class MemberService extends BaseService<Member, Prisma.MemberCreateInput, Prisma.MemberUpdateInput> {
    constructor() {
        super(MemberRepository);
    }
}

export default new MemberService();