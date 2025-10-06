export const convertDateToIso = (date: string) => {
    return new Date(date)
}

export function mapPrismaErrorToStatus(code: string): number {
    switch (code) {
        case "P2002": return 409; // Conflict
        case "P2003": return 400; // Bad Request
        case "P2025": return 404; // Not Found
        default: return 500;      // Internal Server Error
    }
}

