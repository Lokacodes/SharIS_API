import { AppError } from "./AppError";

const validatePercentTotal = (items: { percent: number }[]) => {
    const total = items.reduce((sum, item) => sum + Number(item.percent || 0), 0);

    if (total > 100 || total < 100) {
        throw new AppError(
            `total persentase alokasi SHU tidak boleh lebih atau kurang dari 100% (saat ini ${total}%)`,
            400
        );
    }
};

export default validatePercentTotal


