
import { Request, Response } from 'express';
import { Member, Prisma } from '../../generated/prisma';
import { BaseController } from '../base/base.controller';
import memberService from './member.service';
import { AppError } from '../../utils/AppError';
import ResponseBuilder from '../../utils/ResponseBuilder';

class MemberController extends BaseController<Member, Prisma.MemberCreateInput, Prisma.MemberUpdateInput> {
    constructor() {
        super(memberService, "Anggota");
    }

    async search(req: Request, res: Response) {
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
            return res.status(400).json(new AppError("Query parameter 'name' is required.", 400))
        }
        const members = await memberService.searchByName(name);
        res.json(ResponseBuilder.success(members));
    }

    async getMemberWithLoansById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json(new AppError("ID member tidak valid", 400));
        }
        const memberWithLoans = await memberService.getMemberWithLoansById(id);
        console.error(memberWithLoans)
        if (!memberWithLoans) {
            return res.status(404).json(new AppError("member tidak ditemukan", 404));
        }
        res.json(ResponseBuilder.success(memberWithLoans, "sukses mendapatkan member"));
    }

    async getMemberCount(req: Request, res: Response) {
        const memberCount = await memberService.getNumberOf({
            where: { memberStatus: 'AKTIF' }
        });

        res.json(ResponseBuilder.success(memberCount, "sukses mendapatkan jumlah member"));
    }
}

export default new MemberController();
