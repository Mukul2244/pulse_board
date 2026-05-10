import { Response } from "express";

class ApiResponse {
    static ok<T>(
        res: Response,
        message = "Success",
        data: T | null = null
    ) {
        return res.status(200).json({
            success: true,
            message,
            data,
        });
    }

    static created<T>(
        res: Response,
        message = "Created Successfully",
        data: T | null = null
    ) {
        return res.status(201).json({
            success: true,
            message,
            data,
        });
    }

    static noContent(res: Response) {
        return res.status(204).send();
    }
}

export default ApiResponse;