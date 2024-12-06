interface IVoting {
  searchId: string;
  searchDate: Date;
  state: string;
  city: string;
  votingIntention: string;
  createdAt?: Date;
}
export class Voting {
  constructor(
    private searchId: string,
    private searchDate: Date,
    private state: string,
    private city: string,
    private votingIntention: string,
    private createdAt?: Date
  ) {}

  static create(params: IVoting) {
    const { searchId, searchDate, state, city, votingIntention } =
      params;
    return new Voting(
      searchId,
      searchDate,
      state,
      city,
      votingIntention,
    );
  }

  static restore(params: IVoting) {
    const { searchId, searchDate, state, city, createdAt, votingIntention } =
      params;
    return new Voting(
      searchId,
      searchDate,
      state,
      city,
      votingIntention,
      createdAt
    );
  }

  getSearchId() {
    return this.searchId;
  }

  getSearchDate() {
    return this.searchDate;
  }

  getState() {
    return this.state;
  }

  getCity() {
    return this.city;
  }

  getVotingIntention() {
    return this.votingIntention;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  toJSON() {
    return {
      searchId: this.searchId,
      searchDate: this.searchDate,
      state: this.state,
      city: this.city,
      votingIntention: this.votingIntention,
      createdAt: this.createdAt,
    };
  }
}
