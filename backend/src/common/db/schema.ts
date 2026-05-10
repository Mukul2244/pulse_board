import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersTable = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    firstName: varchar('first_name', { length: 45 }).notNull(),
    lastName: varchar('last_name', { length: 45 }),

    email: varchar('email', { length: 322 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),

    // bcrypt embeds the salt in the hash — no need for a separate salt column
    password: varchar('password', { length: 255 }),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  }
)

// ─── Email verification tokens ────────────────────────────────────────────────
// Needed to actually verify emails — was missing entirely from original schema

export const emailVerificationTokensTable = pgTable(
  'email_verification_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),

    // Store as a hashed token — never store raw tokens in DB
    tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('idx_evt_user_id').on(t.userId)]
)

// ─── Refresh tokens ──────────────────────────────────────────────────────────

export const refreshTokensTable = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 500 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    revokedAt: timestamp('revoked_at'),
  },
  (t) => [index('idx_rt_user_id').on(t.userId)]
)

// ─── Polls ────────────────────────────────────────────────────────────────────

export const pollsTable = pgTable(
  'polls',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    creatorId: uuid('creator_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),

    // Short slug for shareable URLs e.g. /poll/abc123xy
    // Generate with nanoid(8) before insert
    uniqueLink: varchar('unique_link', { length: 12 }).notNull().unique(),

    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),

    isAnonymous: boolean('is_anonymous').notNull().default(true),
    isPublished: boolean('is_published').notNull().default(false),
    expiresAt: timestamp('expires_at'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (t) => [
    // Fetch all polls by a creator efficiently
    index('idx_polls_creator_id').on(t.creatorId),
  ]
)

// ─── Questions ────────────────────────────────────────────────────────────────

export const questionsTable = pgTable(
  'questions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pollId: uuid('poll_id')
      .notNull()
      .references(() => pollsTable.id, { onDelete: 'cascade' }),

    text: text('text').notNull(),
    isMandatory: boolean('is_mandatory').notNull().default(true),
    order: integer('order').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (t) => [
    index('idx_questions_poll_id').on(t.pollId),

    // Two questions in the same poll cannot share the same position
    uniqueIndex('uq_questions_poll_order').on(t.pollId, t.order),
  ]
)

// ─── Options ──────────────────────────────────────────────────────────────────

export const optionsTable = pgTable(
  'options',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questionsTable.id, { onDelete: 'cascade' }),

    text: varchar('text', { length: 255 }).notNull(),
    order: integer('order').notNull(),
  },
  (t) => [
    index('idx_options_question_id').on(t.questionId),

    // Two options in the same question cannot share the same position
    uniqueIndex('uq_options_question_order').on(t.questionId, t.order),
  ]
)

// ─── Responses ────────────────────────────────────────────────────────────────

export const responsesTable = pgTable(
  'responses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pollId: uuid('poll_id')
      .notNull()
      .references(() => pollsTable.id, { onDelete: 'cascade' }),

    // Null for anonymous respondents
    respondentId: uuid('respondent_id').references(() => usersTable.id, {
      onDelete: 'set null',
    }),

    // UUID token set in a cookie for anonymous respondents.
    // Checked on every submission to prevent duplicate anonymous votes.
    // Null for authenticated respondents (use respondentId uniqueness instead).
    anonToken: varchar('anon_token', { length: 64 }),

    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },
  (t) => [
    index('idx_responses_poll_id').on(t.pollId),
    index('idx_responses_respondent_id').on(t.respondentId),

    // One authenticated user → one response per poll
    // This is a partial unique index (only applies when respondentId is not null).
    // Drizzle doesn't support partial indexes natively yet — add this via a
    // raw SQL migration:
    //   CREATE UNIQUE INDEX uq_responses_poll_respondent
    //   ON responses (poll_id, respondent_id)
    //   WHERE respondent_id IS NOT NULL;
    uniqueIndex('uq_responses_poll_anon_token').on(t.pollId, t.anonToken),
  ]
)

// ─── Answers ──────────────────────────────────────────────────────────────────

export const answersTable = pgTable(
  'answers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    responseId: uuid('response_id')
      .notNull()
      .references(() => responsesTable.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questionsTable.id, { onDelete: 'cascade' }),
    optionId: uuid('option_id')
      .notNull()
      .references(() => optionsTable.id, { onDelete: 'cascade' }),
  },
  (t) => [
    index('idx_answers_response_id').on(t.responseId),
    index('idx_answers_question_id').on(t.questionId),

    // One answer per question per response — prevents double-answering
    uniqueIndex('uq_answers_response_question').on(t.responseId, t.questionId),
  ]
)