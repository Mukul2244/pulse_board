import BaseDto from "@/common/dto/base.dto";
import * as z from "zod";

export class CreateQuestionDto extends BaseDto {
    static schema = z.object({
        text: z
            .string()
            .min(3, "Question text must be at least 3 characters"),

        isMandatory: z
            .boolean()
            .default(true),

        order: z
            .number()
            .int()
            .positive(),
    });
}