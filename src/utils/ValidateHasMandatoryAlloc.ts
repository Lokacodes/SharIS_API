import { AppError } from "./AppError";

const validateMandatoryAlloc = (items: { key: String }[]) => {
    return items.find(item => item.key.includes('simpanan')) && items.find(item => item.key.includes('pinjaman'))
};

export default validateMandatoryAlloc