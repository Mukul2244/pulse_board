import { Router } from "express";

import * as questionsController from "./questions.controller";

import { restrictToAuthenticatedUser } from "../auth/auth.middleware";
import validate from "@/common/middleware/validate.middleware";
import { CreateQuestionDto } from "./questions.dto";

const router = Router({ mergeParams: true });

// /api/polls/:pollId/questions
router
    .post(
        "/",
        restrictToAuthenticatedUser(),
        validate(CreateQuestionDto.schema),
        questionsController.addQuestionToPoll
    );

router
    .delete(
        "/:questionId",
        restrictToAuthenticatedUser(),
        questionsController.deleteQuestion
    );

export default router;
