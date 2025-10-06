import { PrismaClient, User, Prisma } from "@prisma/client";

import { BaseRepository } from "../base/base.repository";

const prisma = new PrismaClient()

class AuthRepository extends BaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
    constructor() {
        super(prisma.user)
    }

    async findByEmail(query: string) {
        return this.model.findUnique({ where: { email: query } })
    }
}

export default new AuthRepository()