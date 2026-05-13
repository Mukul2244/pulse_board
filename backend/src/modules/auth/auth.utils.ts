import jwt, { Secret, SignOptions } from "jsonwebtoken";

export function generateAccessToken(payload: object) {
    const secret: Secret = process.env.JWT_SECRET!;

    const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(payload: object) {
    const secret: Secret = process.env.JWT_REFRESH_SECRET!;

    const options: SignOptions = {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
}