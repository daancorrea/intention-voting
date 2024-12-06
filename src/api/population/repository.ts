import prisma from "../../infra/prismaClient";
import { Population } from "../entities/population";

export interface IPopulationRepository {
  create(population: Population): Promise<void>;
  getByCityName(cityName: string): Promise<Population | null>;
  findOneAndUpdate(
    cityName: string,
    populationCount: number
  ): Promise<Population | null>;
  getByCityAndState(
    cityName: string,
    state: string
  ): Promise<Population | null>
}

export class PopulationRepository implements IPopulationRepository {
  async create(population: Population): Promise<void> {
    const dbHandler = prisma;
    await dbHandler.population.create({
      data: {
        cityName: population.getCityName(),
        population: population.getPopulation(),
        state: population.getState(),
        year: population.getYear(),
      },
    });
  }

  async getByCityName(cityName: string): Promise<Population | null> {
    const dbHandler = prisma;
    try {
      const [population] = await Promise.all([
        dbHandler.population.findFirst({
          where: {
            cityName,
          },
        }),
      ]);
      if (!population) {
        return null;
      }
      return Population.restore({
        cityName: population.cityName,
        population: population.population,
        state: population.state,
        year: population.year,
        createdAt: population.createdAt,
        updatedAt: population.updatedAt,
      });
    } catch (error) {
      throw new Error("Error to get city by name");
    }
  }

  async findOneAndUpdate(
    cityName: string,
    populationCount: number
  ): Promise<Population | null> {
    try {
      const population = await prisma.population.findFirst({
        where: {
          cityName,
        },
      });
      if (!population) {
        return null;
      }
      const updated = await prisma.population.update({
        where: {
          id: population.id,
        },
        data: {
          population: populationCount,
        },
      });
      return Population.restore({
        cityName: updated.cityName,
        population: updated.population,
        state: updated.state,
        year: updated.year,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      });
    } catch (error) {
      throw new Error("Error to find and update");
    }
  }

  async getByCityAndState(
    cityName: string,
    state: string
  ): Promise<Population | null> {
    const dbHandler = prisma;
    try {
      const [population] = await Promise.all([
        dbHandler.population.findFirst({
          where: {
            cityName,
            state
          },
        }),
      ]);
      if (!population) {
        return null;
      }
      return Population.restore({
        cityName: population.cityName,
        population: population.population,
        state: population.state,
        year: population.year,
        createdAt: population.createdAt,
        updatedAt: population.updatedAt,
      });
    } catch (error) {
      throw new Error("Error to get city by name and state");
    }
  }
}
