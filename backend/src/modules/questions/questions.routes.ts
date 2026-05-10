import { Router } from "express";
import * as questionsController from "./questions.controller";
import { restrictToAuthenticatedUser } from "../auth/auth.middleware";

const router: import("express").Router = Router();

// /api/polls/:pollId/questions
router.post("/", restrictToAuthenticatedUser(), questionsController.addQuestionToPoll);
router.delete("/:questionId", restrictToAuthenticatedUser(), questionsController.deleteQuestion);

export default router;
