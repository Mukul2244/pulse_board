import { Router } from "express";

import {
    loginController,
    registerController,
    refreshTokenController,
} from "./auth.controller";
import validate from "@/common/middleware/validate.middleware";
import { RegisterDto } from "./auth.dto";

const router = Router();

router.post("/register",validate(RegisterDto.schema), registerController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

export default router;