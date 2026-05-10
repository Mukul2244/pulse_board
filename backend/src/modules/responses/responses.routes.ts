import { Router } from "express";
import * as responsesController from "./responses.controller";

const router: import("express").Router = Router();

// /api/polls/:pollId/responses
// It will parse token inside controller since it can be anonymous
router.post("/", responsesController.submitResponse);

export default router;
