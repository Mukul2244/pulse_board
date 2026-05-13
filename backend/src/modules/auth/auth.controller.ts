import { Request, Response, NextFunction } from "express";
import ApiResponse from "@/common/utils/api-response";

import {
    LoginDto,
    RegisterDto,
    RefreshTokenDto,
} from "./auth.dto";

import * as authService from "./auth.service";

export async function registerController(req: Request, res: Response, next: NextFunction) {
    try {
        const { errors, value } = RegisterDto.validate(req.body);

        if (errors) {
            return res.status(400).json({
                errors,
            });
        }
        const user = await authService.register(value);

        return ApiResponse.created(
            res,
            "User registered successfully",
            user
        );
    } catch (error) {
        next(error);
    }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const { errors, value } =
            LoginDto.validate(req.body);

        if (errors) {
            return res.status(400).json({
                errors,
            });
        }

        const data =
            await authService.login(value);

        return ApiResponse.ok(
            res,
            "Login successful",
            data
        );
    } catch (error) {
        next(error);
    }
}
export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
    try {
        const { errors, value } = RefreshTokenDto.validate(req.body);

        if (errors) {
            return res.status(400).json({ errors });
        }

        const data = await authService.refreshToken(value);

        return ApiResponse.ok(
            res,
            "Token refreshed successfully",
            data
        );
    } catch (error) {
        next(error);
    }
}
