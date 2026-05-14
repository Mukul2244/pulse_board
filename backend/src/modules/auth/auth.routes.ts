import { Router } from "express";

import {
    loginController,
    registerController,
    refreshTokenController,
} from "./auth.controller";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

export default router;