import { Router } from "express";
import type { Router as RouterType } from "express";

import {
    loginController,
    registerController,
    refreshTokenController,
} from "./auth.controller";

const router: RouterType = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

export default router;