import { Prisma, TenorOption } from "@prisma/client";
import { BaseService } from "../base/base.service";
import TenorOptionRepository from "./tenorOption.repository"

class TenorOptionService extends BaseService<TenorOption, Prisma.TenorOptionCreateInput, Prisma.TenorOptionUpdateInput> {
    constructor() {
        super(TenorOptionRepository)
    }

}

export default new TenorOptionService()