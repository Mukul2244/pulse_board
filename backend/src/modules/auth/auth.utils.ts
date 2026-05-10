import jwt from "jsonwebtoken";

export function generateAccessToken(
    payload: object
) {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        {
            expiresIn: "15m",
        }
    );
}

export function generateRefreshToken(
    payload: object
) {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn: "7d",
        }
    );
}