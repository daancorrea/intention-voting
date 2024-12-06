import { IntentionResult } from "../entities/intentionResult";
import prisma from "../../infra/prismaClient";

export interface IIntentionResultRepository {
  create(intentionResult: IntentionResult): Promise<void>;
  getBySearchId(searchId: string): Promise<IntentionResult[] | null>;
}

export class IntentionRepository implements IIntentionResultRepository {
  async create(intentionResult: IntentionResult): Promise<void> {
    await prisma.intentionResult.create({
      data: {
        searchId: intentionResult.getSearchId(),
        state: intentionResult.getState(),
        statePopulation: intentionResult.getStatePopulation(),
        percentVoting: intentionResult.getPercentVoting(),
        candidateAhead: intentionResult.getCandidateAhead(),
      },
    });
  }
  async getBySearchId(searchId: string): Promise<IntentionResult[] | null> {
    try {
      const result = await prisma.intentionResult.findMany({
        where: {
          searchId,
        },
      });
      if (!result) {
        return null;
      }

      return result.map((data) =>
        IntentionResult.restore({
          searchId: data.searchId,
          state: data.state,
          statePopulation: data.statePopulation,
          percentVoting: data.percentVoting,
          candidateAhead: data.candidateAhead,
          createdAt: data.createdAt,
        })
      );
    } catch (error) {
      throw new Error("Error to get intention result by search id");
    }
  }
}
