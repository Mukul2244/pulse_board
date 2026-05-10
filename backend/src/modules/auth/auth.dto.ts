import * as z from "zod";

import BaseDto from "@/common/dto/base.dto";

export class RegisterDto extends BaseDto {
    static schema = z.object({
        firstName: z.string().min(2),

        lastName: z.string().optional(),

        email: z.email(),

        password: z.string().min(6),
    });
}

export class LoginDto extends BaseDto {
    static schema = z.object({
        email: z.email(),

        password: z.string().min(6),
    });
}

export class RefreshTokenDto extends BaseDto {
    static schema = z.object({
        refreshToken: z.string().min(1),
    });
}