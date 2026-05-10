import * as z from "zod";
import BaseDto from "@/common/dto/base.dto";

export class CreatePollDto extends BaseDto {
    static schema = z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        isAnonymous: z.boolean().default(true),
        expiresAt: z.string().datetime().optional()
    });
}
