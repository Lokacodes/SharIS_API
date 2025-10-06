export class BaseRepository<T, CreateInput, UpdateInput> {
    protected model: any
    constructor(model: any) {
        this.model = model;
    }

    async findById(id: number) {
        return this.model.findUnique({ where: { id } });
    }

    async findAll(args?: any) {
        return this.model.findMany(args);
    }

    async create(data: CreateInput) {
        return this.model.create({ data });
    }

    async update(data: UpdateInput, id: number) {
        return this.model.update({ where: { id }, data });
    }

    async delete(id: number) {
        return this.model.delete({ where: { id } });
    }
}
