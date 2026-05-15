import * as responsesRepository from "./responses.repository";
import { getPollByIdOrLink } from "../polls/polls.repository";
import ApiError from "@/common/utils/api-error";
import { getIO } from "@/common/socket";
import { getPollAnalytics } from "../polls/polls.repository";

export async function submitResponse(uniqueId: string, respondentId: string | null, anonToken: string | null, answers: Array<{ questionId: string, optionId: string }>) {

  // ── 1. Find poll ────────────────────────────────────────────────────────
  const poll = await getPollByIdOrLink(uniqueId);
  if (!poll) throw ApiError.notFound("Poll not found");

  // ── 2. Check expiry ─────────────────────────────────────────────────────
  if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
    throw ApiError.badRequest("Poll has expired");
  }

  // ── 3. Check not already published/closed ───────────────────────────────
  // if (poll.isPublished) {
  //   throw ApiError.badRequest("Poll is closed and no longer accepting responses");
  // }


  // ── 4. Auth check ───────────────────────────────────────────────────────
  if (!poll.isAnonymous && !respondentId) {
    throw ApiError.unauthorized("Authentication required to respond to this poll");
  }

  // ── 5. Anon token check ─────────────────────────────────────────────────
  if (poll.isAnonymous && !anonToken) {
    throw ApiError.badRequest("Anonymous token is required");
  }

  // ── 6. Duplicate submission check ───────────────────────────────────────
  const duplicate = await responsesRepository.findExistingResponse(
    poll.id,
    respondentId,
    anonToken,
  );
  if (duplicate) {
    throw ApiError.conflict("You have already responded to this poll");
  }

  // ── 7. Validate mandatory questions answered ─────────────────────────────
  const mandatoryIds = poll.questions
    .filter((q) => q.isMandatory)
    .map((q) => q.id);

  const answeredIds = answers.map((a) => a.questionId);

  const unanswered = mandatoryIds.filter((id) => !answeredIds.includes(id));
  if (unanswered.length > 0) {
    throw ApiError.badRequest("All mandatory questions must be answered");
  }

  // ── 8. Validate options belong to their questions ───────────────────────
  const optionMap = new Map(
    poll.questions.flatMap((q) =>
      q.options.map((o) => [`${q.id}:${o.id}`, true])
    )
  );

  for (const answer of answers) {
    const valid = optionMap.has(`${answer.questionId}:${answer.optionId}`);
    if (!valid) {
      throw ApiError.badRequest(
        `Option ${answer.optionId} does not belong to question ${answer.questionId}`
      );
    }
  }

  // ── 9. Save response ────────────────────────────────────────────────────
  const response = await responsesRepository.submitResponse(
    poll.id,
    respondentId,
    anonToken,
    answers,
  );
  // ── 10. Emit real-time update ───────────────────────────────────────────
  const analytics = await getPollAnalytics(poll.id);
  getIO()
    .to(`poll_${poll.uniqueLink}`)
    .emit("poll:updated", analytics);

  return response;
}
