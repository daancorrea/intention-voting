import { Voting } from "../entities/voting";
import prisma from "../../infra/prismaClient";

export interface IVotingRepository {
  create(voting: Voting): Promise<void>;
  getByCityNameAndSearchId(params: {
    cityName: string;
    searchId: string;
  }): Promise<Voting | null>;
  getBySearchId(searchId: string): Promise<Voting[] | null>;
}

export class VotingRepository implements IVotingRepository {
  async create(voting: Voting): Promise<void> {
    await prisma.voting.create({
      data: {
        city: voting.getCity(),
        searchDate: voting.getSearchDate(),
        state: voting.getState(),
        searchId: voting.getSearchId(),
        votingIntention: voting.getVotingIntention(),
      },
    });
  }

  async getByCityNameAndSearchId(params: {
    cityName: string;
    searchId: string;
  }): Promise<Voting | null> {
    const result = await prisma.voting.findFirst({
      where: {
        city: params.cityName,
        searchId: params.searchId,
      },
    });
    if (!result) {
      return null;
    }

    return Voting.restore({
      city: result.city,
      createdAt: result.createdAt,
      searchDate: result.searchDate,
      searchId: result.searchId,
      state: result.state,
      votingIntention: result.votingIntention,
    });
  }

  async getBySearchId(searchId: string): Promise<Voting[] | null> {
    const result = await prisma.voting.findMany({
      where: {
        searchId,
      },
    });
    if (result.length === 0 || !result) {
      return null;
    }

    return result.map((data) =>
      Voting.restore({
        city: data.city,
        createdAt: data.createdAt,
        searchDate: data.searchDate,
        searchId: data.searchId,
        state: data.state,
        votingIntention: data.votingIntention,
      })
    );
  }
}
