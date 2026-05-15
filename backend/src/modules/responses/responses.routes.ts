import { Router } from "express";
import * as responsesController from "./responses.controller";
import { attachAnonymousToken } from "@/common/middleware/anonymous.middleware";

const router = Router({ mergeParams: true });

// /api/polls/:uniqueId/responses
// It will parse token inside controller since it can be anonymous
router.post("/", attachAnonymousToken, responsesController.submitResponse);

export default router;
