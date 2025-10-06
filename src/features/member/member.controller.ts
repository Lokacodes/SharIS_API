import { Member, Prisma } from '../../generated/prisma';
import { BaseController } from '../base/base.controller';
import memberService from './member.service';

class MemberController extends BaseController<Member, Prisma.MemberCreateInput, Prisma.MemberUpdateInput> {
    constructor() {
        super(memberService, "Anggota");
    }
}

export default new MemberController();
