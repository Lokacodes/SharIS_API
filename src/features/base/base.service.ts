import { AppError } from "../../utils/AppError";
import { BaseRepository } from "./base.repository";

export class BaseService<T, CreateInput, UpdateInput> {
    protected repository: BaseRepository<T, CreateInput, UpdateInput>;

    constructor(repository: BaseRepository<T, CreateInput, UpdateInput>) {
        this.repository = repository;
    }

    async findById(id: number) {
        const result = await this.repository.findById(id)
        if (!result) {
            throw new AppError("Data tidak ditemukan", 404)
        }

        return result
    }

    async findAll(args?: any) {
        return this.repository.findAll(args);
    }

    async findFirst(args?: any) {
        return this.repository.findFirst(args);
    }

    async getNumberOf(args?: any) {
        return this.repository.getNumberOf(args)
    }

    async create(data: CreateInput) {
        return this.repository.create(data);
    }

    async update(data: UpdateInput, id: number) {
        await this.findById(id)
        return this.repository.update(data, id);
    }

    async delete(id: number) {
        await this.findById(id)
        return this.repository.delete(id)
    }
}
