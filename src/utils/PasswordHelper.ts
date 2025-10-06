import { hash, compare } from "bcryptjs";

export class Password {
    private static saltRounds = 10;

    static async hash(password: string): Promise<string> {
        return hash(password, this.saltRounds);
    }

    static async compare(password: string, hash: string): Promise<boolean> {
        return compare(password, hash);
    }
}
