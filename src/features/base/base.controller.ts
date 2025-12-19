import { Request, Response } from "express";
import { BaseService } from "./base.service";
import { convertDateToIso } from "../../utils/Utils";
import ResponseBuilder from "../../utils/ResponseBuilder";
import { AppError } from "../../utils/AppError";

export class BaseController<T, CreateInput, UpdateInput, Req extends Request = Request, Res extends Response = Response> {
    protected service: BaseService<T, CreateInput, UpdateInput>;
    protected resourceName: string;

    constructor(service: BaseService<T, CreateInput, UpdateInput>, resourceName: string) {
        this.service = service;
        this.resourceName = resourceName
    }

    getOne = async (req: Req, res: Res) => {
        const { id } = req.params;
        const result = await this.service.findById(Number(id));
        res.json(ResponseBuilder.success(result, `${this.resourceName} ditemukan`))
    };

    getAll = async (req: Req, res: Res) => {
        const result = await this.service.findAll();

        res.json(ResponseBuilder.success(result, `daftar ${this.resourceName} berhasil didapatkan`))
    };

    getNumberOf = async (req: Req, res: Res) => {
        const result = await this.service.getNumberOf();

        res.json(ResponseBuilder.success(result, `Jumlah ${this.resourceName} berhasil didapatkan`))
    }

    create = async (req: Req, res: Res) => {
        const result = await this.service.create(req.body);

        res.json(ResponseBuilder.success(result, `${this.resourceName} berhasil dibuat`))
    };

    update = async (req: Req, res: Res) => {
        const { id } = req.params;
        const result = await this.service.update(req.body, Number(id));

        res.json(ResponseBuilder.success(result, `${this.resourceName} berhasil diperbarui`))
    };

    delete = async (req: Req, res: Res) => {
        const { id } = req.params;
        const result = await this.service.delete(Number(id));
        res.json(ResponseBuilder.success(result, `${this.resourceName} berhasil dihapus`))
    };
}

