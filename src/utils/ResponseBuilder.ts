export default class ResponseBuilder<T = any> {
    static success<T>(data: T, message = "Success") {
        return {
            success: true,
            message,
            data,
        };
    }

    static error(message: string, statusCode: number, details: any = null) {
        return {
            success: false,
            message,
            statusCode,
            details,
        };
    }
}
