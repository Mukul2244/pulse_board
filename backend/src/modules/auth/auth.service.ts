import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import ApiError from "@/common/utils/api-error";

import * as authRepository from "./auth.repository";

import {
    generateAccessToken,
    generateRefreshToken,
} from "./auth.utils";

export async function register(data: any) {
    const existingUser =
        await authRepository.findUserByEmail(
            data.email
        );

    if (existingUser) {
        throw ApiError.conflict(
            "Email already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(data.password, 10);

    const user =
        await authRepository.createUser({
            ...data,
            password: hashedPassword,
        });

    return user;
}

export async function login(data: any) {
    const user =
        await authRepository.findUserByEmail(
            data.email
        );

    if (!user || !user.password) {
        throw ApiError.unauthorized(
            "Invalid credentials"
        );
    }

    const isValid =
        await bcrypt.compare(
            data.password,
            user.password
        );

    if (!isValid) {
        throw ApiError.unauthorized(
            "Invalid credentials"
        );
    }

    const payload = {
        sub: user.id,
        email: user.email,
    };

    const accessToken =
        generateAccessToken(payload);

    const refreshToken =
        generateRefreshToken(payload);

    return {
        user,
        accessToken,
        refreshToken,
    };
}
export async function refreshToken(data: { refreshToken: string }) {
    try {
        const decoded = jwt.verify(data.refreshToken, process.env.JWT_REFRESH_SECRET!) as { sub: string, email: string };
        
        const payload = {
            sub: decoded.sub,
            email: decoded.email,
        };

        const accessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    } catch(err) {
        throw ApiError.unauthorized("Invalid or expired refresh token");
    }
}
