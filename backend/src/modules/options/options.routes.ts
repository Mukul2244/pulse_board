import { Router } from "express";
import * as optionsController from "./options.controller";
import { restrictToAuthenticatedUser } from "../auth/auth.middleware";

const router = Router({ mergeParams: true });

// /api/questions/:questionId/options
router.post("/", restrictToAuthenticatedUser(), optionsController.addOptionToQuestion);
router.delete("/:optionId", restrictToAuthenticatedUser(), optionsController.deleteOption);

export default router;
