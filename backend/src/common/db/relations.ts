// src/common/db/relations.ts
import { relations } from "drizzle-orm";
import {
  usersTable,
  pollsTable,
  questionsTable,
  optionsTable,
  responsesTable,
  answersTable,
  emailVerificationTokensTable,
  refreshTokensTable,
} from "./schema";

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersRelations = relations(usersTable, ({ many }) => ({
  polls:                   many(pollsTable),
  responses:               many(responsesTable),
  refreshTokens:           many(refreshTokensTable),
  emailVerificationTokens: many(emailVerificationTokensTable),
}));

// ─── Email verification tokens ────────────────────────────────────────────────
export const emailVerificationTokensRelations = relations(
  emailVerificationTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields:     [emailVerificationTokensTable.userId],
      references: [usersTable.id],
    }),
  })
);

// ─── Refresh tokens ───────────────────────────────────────────────────────────
export const refreshTokensRelations = relations(
  refreshTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields:     [refreshTokensTable.userId],
      references: [usersTable.id],
    }),
  })
);

// ─── Polls ────────────────────────────────────────────────────────────────────
export const pollsRelations = relations(pollsTable, ({ one, many }) => ({
  creator:   one(usersTable, {
    fields:     [pollsTable.creatorId],
    references: [usersTable.id],
  }),
  questions: many(questionsTable),
  responses: many(responsesTable),
}));

// ─── Questions ────────────────────────────────────────────────────────────────
export const questionsRelations = relations(questionsTable, ({ one, many }) => ({
  poll: one(pollsTable, {
    fields:     [questionsTable.pollId],
    references: [pollsTable.id],
  }),
  options: many(optionsTable),
  answers: many(answersTable),
}));

// ─── Options ──────────────────────────────────────────────────────────────────
export const optionsRelations = relations(optionsTable, ({ one, many }) => ({
  question: one(questionsTable, {
    fields:     [optionsTable.questionId],
    references: [questionsTable.id],
  }),
  answers: many(answersTable),
}));

// ─── Responses ────────────────────────────────────────────────────────────────
export const responsesRelations = relations(responsesTable, ({ one, many }) => ({
  poll: one(pollsTable, {
    fields:     [responsesTable.pollId],
    references: [pollsTable.id],
  }),
  respondent: one(usersTable, {
    fields:     [responsesTable.respondentId],
    references: [usersTable.id],
  }),
  answers: many(answersTable),
}));

// ─── Answers ──────────────────────────────────────────────────────────────────
export const answersRelations = relations(answersTable, ({ one }) => ({
  response: one(responsesTable, {
    fields:     [answersTable.responseId],
    references: [responsesTable.id],
  }),
  question: one(questionsTable, {
    fields:     [answersTable.questionId],
    references: [questionsTable.id],
  }),
  option: one(optionsTable, {
    fields:     [answersTable.optionId],
    references: [optionsTable.id],
  }),
}));