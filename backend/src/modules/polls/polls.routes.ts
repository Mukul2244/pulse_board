import { Router } from "express";

import * as pollsController from "./polls.controller";

import { restrictToAuthenticatedUser } from "../auth/auth.middleware";

import validate from "@/common/middleware/validate.middleware";

import { CreatePollDto } from "./polls.dto";
import { attachAnonymousToken } from "@/common/middleware/anonymous.middleware";

const router = Router({ mergeParams: true });

router
    .post(
        "/",
        restrictToAuthenticatedUser(),
        validate(CreatePollDto.schema),
        pollsController.createPoll
    );

router
    .get(
        "/",
        restrictToAuthenticatedUser(),
        attachAnonymousToken,
        pollsController.getMyPolls
    );

router
    .get(
        "/:id",
        pollsController.getPollById
    );

router
    .put(
        "/:id/publish",
        restrictToAuthenticatedUser(),
        pollsController.publishPoll
    );
router
    .get(
        "/:id/analytics",
        restrictToAuthenticatedUser(),
        pollsController.getPollAnalytics
    );

export default router;
