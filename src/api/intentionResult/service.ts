import { IntentionResult, IIntentionResult } from "../entities/intentionResult";
import { IIntentionResultRepository, IntentionRepository } from "./repository";

// export interface IntentionResultService {}
export class IntentionResultService {
  intentionRepository: IIntentionResultRepository;
  constructor() {
    this.intentionRepository = new IntentionRepository();
  }

  async create(params: IIntentionResult): Promise<void> {
    const { candidateAhead, percentVoting, searchId, state, statePopulation } =
      params;
    await this.intentionRepository.create(
      IntentionResult.create({
        candidateAhead,
        percentVoting,
        searchId,
        state,
        statePopulation,
      })
    );
  }

  async getBySearchId(searchId: string): Promise<IntentionResult[] | null> {
    return this.intentionRepository.getBySearchId(searchId);
  }
}
