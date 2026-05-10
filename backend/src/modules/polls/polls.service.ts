import { nanoid } from "@/common/utils/nanoid";
import * as pollsRepository from "./polls.repository";
import ApiError from "@/common/utils/api-error";

export async function createPoll(creatorId: string, data: any) {
    const uniqueLink = nanoid(8);
    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    
    return pollsRepository.createPoll({
        creatorId,
        uniqueLink,
        title: data.title,
        description: data.description,
        isAnonymous: data.isAnonymous,
        expiresAt
    });
}

export async function getPollsByCreatorId(creatorId: string) {
    return pollsRepository.getPollsByCreatorId(creatorId);
}

export async function getPollByIdOrLink(idOrLink: string) {
    return pollsRepository.getPollByIdOrLink(idOrLink);
}

export async function publishPoll(creatorId: string, pollId: string) {
    const poll = await pollsRepository.getPollById(pollId);
    if (!poll) throw ApiError.notFound("Poll not found");
    if (poll.creatorId !== creatorId) throw ApiError.forbidden("Not authorized");
    
    return pollsRepository.updatePoll(pollId, { isPublished: true });
}

export async function getPollAnalytics(creatorId: string, pollId: string) {
    const poll = await pollsRepository.getPollById(pollId);
    if (!poll) throw ApiError.notFound("Poll not found");
    if (poll.creatorId !== creatorId) throw ApiError.forbidden("Not authorized");

    return pollsRepository.getPollAnalytics(pollId);
}
