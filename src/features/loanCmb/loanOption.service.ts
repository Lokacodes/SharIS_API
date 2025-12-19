import { Prisma, LoanOption } from "@prisma/client";
import { BaseService } from "../base/base.service";
import loanOptionRepository from "./loanOption.repository"

class LoanOptionService extends BaseService<LoanOption, Prisma.LoanOptionCreateInput, Prisma.LoanOptionUpdateInput> {
    constructor() {
        super(loanOptionRepository)
    }

}

export default new LoanOptionService()