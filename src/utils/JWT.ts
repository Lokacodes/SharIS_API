import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!
const refreshSecret = process.env.JWT_REFRESH_SECRET!
const expiresIn = "5h"
const refreshExpiresIn = "7d"

export interface JwtPayload {
    userId: string,
    role: string,
}

export function signAccessToken(payload: JwtPayload): String {
    return jwt.sign(payload, secret, { expiresIn: expiresIn })
}
export function signRefreshToken(payload: JwtPayload): String {
    return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn })
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload
}
export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, refreshSecret) as JwtPayload
}