import { User, Prisma, Role } from "@prisma/client";
import { BaseService } from "../base/base.service";
import AuthRepository from "./auth.repository";
import { Password } from "../../utils/PasswordHelper";
import { AppError } from "../../utils/AppError";
import { compare } from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../../utils/JWT";

const ERROR_MESSAGE = "Invalid Credentials"

class AuthService extends BaseService<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
    constructor() {
        super(AuthRepository)
    }

    async register(data: {
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<User> {
        const existing = await AuthRepository.findByEmail(data.email);

        if (existing) {
            throw new AppError("Email sudah terdaftar", 400);
        }

        const hashedPassword = await Password.hash(data.password);

        return this.repository.create({
            ...data,
            password: hashedPassword,
            role: data.role as Role
        });
    }

    async login(data: {
        email: string;
        password: string;
    }) {
        const existing = await AuthRepository.findByEmail(data.email);

        if (!existing) {
            throw new AppError(ERROR_MESSAGE, 404)
        }

        const isPasswordCorrect = await compare(data.password, existing.password)

        if (!isPasswordCorrect) {
            throw new AppError(ERROR_MESSAGE, 400)
        }

        const payload = {
            userId: existing.id,
            role: existing.role
        }

        const tokens = {
            accessToken: signAccessToken(payload),
            refreshToken: signRefreshToken(payload)
        }

        return tokens
    }

    async updateUser(id: number, data: {
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<User> {
        const isEmailUsed = await AuthRepository.findByEmail(data.email);
        const isExist = await AuthRepository.findById(id)

        if (!isExist) {
            throw new AppError("user tidak ditemukan")
        }

        if (isEmailUsed && isEmailUsed.id !== id) {
            throw new AppError("Email sudah terdaftar", 400);
        }

        const hashedPassword = await Password.hash(data.password);

        return this.repository.update({
            ...data,
            password: hashedPassword,
            role: data.role as Role
        }, id);
    }
}

export default new AuthService()