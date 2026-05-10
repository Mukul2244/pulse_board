import * as responsesRepository from "./responses.repository";
import { getPollByIdOrLink } from "../polls/polls.repository";
import ApiError from "@/common/utils/api-error";
import { getIO } from "@/common/socket";
import { getPollAnalytics } from "../polls/polls.repository";

export async function submitResponse(pollId: string, respondentId: string | null, anonToken: string | null, answers: Array<{ questionId: string, optionId: string }>) {
    const poll = await getPollByIdOrLink(pollId);
    if (!poll) throw ApiError.notFound("Poll not found");

    if (!poll.isAnonymous && !respondentId) {
        throw ApiError.unauthorized("Authentication required to respond to this poll");
    }

    if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
        throw ApiError.badRequest("Poll has expired");
    }

    const response = await responsesRepository.submitResponse(poll.id, respondentId, anonToken, answers);

    // Get live analytics and broadcast over websocket via socket.io
    const io = getIO();
    const analytics = await getPollAnalytics(poll.id);
    io.to(`poll_${poll.id}`).emit("poll:updated", analytics);

    return response;
}
