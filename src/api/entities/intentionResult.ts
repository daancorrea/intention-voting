export interface IIntentionResult {
  searchId: string;
  state: string;
  statePopulation: number;
  percentVoting: number;
  candidateAhead: string;
  createdAt?: Date;
}
export class IntentionResult {
  constructor(
    private searchId: string,
    private state: string,
    private statePopulation: number,
    private percentVoting: number,
    private candidateAhead: string,
    private createdAt?: Date
  ) {}

  static create(params: IIntentionResult) {
    const { searchId, state, statePopulation, percentVoting, candidateAhead } =
      params;
    return new IntentionResult(
      searchId,
      state,
      statePopulation,
      percentVoting,
      candidateAhead
    );
  }
  static restore(params: IIntentionResult) {
    const {
      searchId,
      state,
      statePopulation,
      percentVoting,
      candidateAhead,
      createdAt,
    } = params;
    return new IntentionResult(
      searchId,
      state,
      statePopulation,
      percentVoting,
      candidateAhead,
      createdAt
    );
  }
  getSearchId() {
    return this.searchId;
  }
  getState() {
    return this.state;
  }
  getStatePopulation() {
    return this.statePopulation;
  }
  getPercentVoting() {
    return this.percentVoting;
  }
  getCandidateAhead() {
    return this.candidateAhead;
  }
  getCreatedAt() {
    return this.createdAt;
  }

  toJSON() {
    return {
      searchId: this.searchId,
      state: this.state,
      statePopulation: this.statePopulation,
      percentVoting: this.percentVoting,
      candidateAhead: this.candidateAhead,
      createdAt: this.createdAt,
    };
  }
}
