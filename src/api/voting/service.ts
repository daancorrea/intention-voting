import { Voting } from "../entities/voting";
import { extractCSVData } from "../../utils/csv";
import { IVotingRepository, VotingRepository } from "./repository";
import { IntentionResultService } from "../intentionResult/service";
import { PopulationService } from "../population/service";

export class VotingService {
  votingRepository: IVotingRepository;
  intentionResultService: IntentionResultService;
  populationService: PopulationService;

  constructor() {
    this.votingRepository = new VotingRepository();
    this.intentionResultService = new IntentionResultService();
    this.populationService = new PopulationService();
  }

  async handleFileUpload(path: string) {
    const votingArr = await extractCSVData(path);
    const findSearchId = await this.votingRepository.getBySearchId(
      votingArr[0].searchId
    );
    if (findSearchId) {
      return {
        message: "Search it is already be saved.",
      };
    }
    await Promise.all(
      votingArr.map(async (votingObj) => {
        const { city, searchDate, searchId, state, votingIntention } =
          votingObj;
        const voting = Voting.create({
          city,
          searchDate,
          searchId,
          state,
          votingIntention,
        });
        await this.votingRepository.create(voting);
      })
    );
    return;
  }

  async makeResultBySearchId(searchId: string) {
    const allVoting = await this.votingRepository.getBySearchId(searchId);

    if (!allVoting || allVoting.length === 0) {
      throw new Error("Search ID not found or no voting data");
    }
    const existingResults = await this.intentionResultService.getBySearchId(searchId);

  if (existingResults && existingResults.length > 0) {
    const response = {
      searchId,
      states: existingResults.map((result) => ({
        state: result.getState(),
        statePopulation: result.getStatePopulation(),
        percentVoting: result.getPercentVoting(),
        candidateAhead: result.getCandidateAhead(),
      })),
      totalPopulation: existingResults.reduce(
        (sum, result) => sum + result.getStatePopulation(),
        0
      ),
      leaderOverall: existingResults.reduce(
        (acc, result) => {
          const candidate = result.getCandidateAhead() as 'A' | 'B';
          acc[candidate] += 1;
          return acc;
        },
        { A: 0, B: 0 }
      ),
    };
    return response;
  }
    const stateVotes: Record<
      string,
      { A: number; B: number; cities: Set<string> }
    > = {};

    for (const vote of allVoting) {
      const state = vote.getState();
      const city = vote.getCity();
      const intention = vote.getVotingIntention() as "A" | "B";

      if (!stateVotes[state]) {
        stateVotes[state] = { A: 0, B: 0, cities: new Set() };
      }

      if (intention === "A" || intention === "B") {
        stateVotes[state][intention] += 1;
        stateVotes[state].cities.add(city);
      }
    }

    const results = [];

    for (const [state, { A, B, cities }] of Object.entries(stateVotes)) {
      const cityArray = Array.from(cities);
      const batchSize = 10;
      let statePopulation = 0;

      for (let i = 0; i < cityArray.length; i += batchSize) {
        const batch = cityArray.slice(i, i + batchSize);
        const populations = await Promise.all(
          batch.map((city) =>
            this.populationService.getByCityAndState(city, state)
          )
        );

        statePopulation += populations.reduce((sum, cityData) => {
          if (cityData) {
            return sum + cityData.getPopulation();
          }
          return sum;
        }, 0);
      }

      const totalVotes = A + B;
      const percentVoting =
        totalVotes > 0 ? Math.round((Math.max(A, B) / totalVotes) * 100) : 0;
      const candidateAhead = A > B ? "A" : "B";

      results.push({
        searchId,
        state,
        statePopulation,
        percentVoting,
        candidateAhead,
      });
    }

    await Promise.all(
      results.map((result) =>
        this.intentionResultService.create({
          searchId: result.searchId,
          state: result.state,
          statePopulation: result.statePopulation,
          percentVoting: result.percentVoting,
          candidateAhead: result.candidateAhead,
        })
      )
    );
    const response = {
      searchId,
      states: results.map((result) => ({
        state: result.state,
        statePopulation: result.statePopulation,
        percentVoting: result.percentVoting,
        candidateAhead: result.candidateAhead,
      })),
      totalPopulation: results.reduce(
        (sum, result) => sum + result.statePopulation,
        0
      ),
      leaderOverall: results.reduce(
        (acc, result) => {
          const candidate = result.candidateAhead as 'A' | 'B';
          acc[candidate] += 1; 
          return acc;
        },
        { A: 0, B: 0 }
      ),
    };
    
    return response;
  }
}
