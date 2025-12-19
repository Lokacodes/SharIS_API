import { Prisma, User } from "@prisma/client";
import { BaseController } from "../base/base.controller";
import AuthService from "./auth.service";
import { Request, Response } from "express";
import ResponseBuilder from "../../utils/ResponseBuilder";

class AuthController extends BaseController<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
    constructor() {
        super(AuthService, "User")
    }

    register = async (req: Request, res: Response) => {
        const result = await AuthService.register(req.body)
        res.json(ResponseBuilder.success(result, "Sukses registrasi user"))
    }

    login = async (req: Request, res: Response) => {
        const result = await AuthService.login(req.body)
        res.json(ResponseBuilder.success(result, "Berhasil Login"))
    }

    updateUser = async (req: Request, res: Response) => {
        const { id } = req.params
        const result = await AuthService.updateUser(Number(id), req.body)
        res.json(ResponseBuilder.success(result, "Sukses update user"))
    }

    refreshSession = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        const result = await AuthService.refreshToken(refreshToken);
        res.json(ResponseBuilder.success(result, "Sukses refresh token"));
    }
}

export default new AuthController()