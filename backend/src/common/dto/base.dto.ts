import * as z from "zod";

class BaseDto {
    static schema = z.object({})

    static validate(data: unknown) {
        const result = this.schema.safeParse(data)
        if (!result.success) {

            return {
                errors: result.error,
                value: null,
            };
        }

        return {
            errors: null,
            value: result.data,
        };
    }

}

export default BaseDto