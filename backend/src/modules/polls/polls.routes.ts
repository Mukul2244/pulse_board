import { Router } from "express";
import * as pollsController from "./polls.controller";
import { restrictToAuthenticatedUser } from "../auth/auth.middleware";

const router: import("express").Router = Router();

router.post("/", restrictToAuthenticatedUser(), pollsController.createPoll);
router.get("/", restrictToAuthenticatedUser(), pollsController.getMyPolls);
router.get("/:id", pollsController.getPollById);
router.put("/:id/publish", restrictToAuthenticatedUser(), pollsController.publishPoll);
router.get("/:id/analytics", restrictToAuthenticatedUser(), pollsController.getPollAnalytics);

export default router;
