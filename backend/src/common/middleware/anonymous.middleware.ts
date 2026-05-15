import { Request, Response, NextFunction } from "express";

import { randomUUID } from "crypto";

export function attachAnonymousToken(
    req: Request,
    res: Response,
    next: NextFunction
) {

    let anonToken = req.cookies.anonToken;

    if (!anonToken) {

        anonToken = randomUUID();

        res.cookie("anonToken", anonToken, {
            httpOnly: true,
            sameSite: "lax",

            secure:
                process.env.NODE_ENV === "production",

            maxAge:
                1000 * 60 * 60 * 24 * 30, // 30 days
        });
    }

    (req as any).anonToken = anonToken;

    next();
}