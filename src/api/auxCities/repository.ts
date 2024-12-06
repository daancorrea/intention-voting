import prisma from "../../infra/prismaClient";
import { AuxCities } from "../entities/auxCities";

export interface IAuxCitiesRepository {
  create(auxCities: AuxCities): Promise<void>;
  getLastChecked(fileName: string): Promise<AuxCities | null>;
}

export class AuxCitiesRespository implements IAuxCitiesRepository {
  async create(auxCities: AuxCities): Promise<void> {
    await prisma.auxCities.create({
      data: {
        fileName: auxCities.getFileName(),
        lastChecked: auxCities.getLastChecked(),
      },
    });
  }

  async getLastChecked(fileName: string): Promise<AuxCities | null> {
    try {
      const auxCities = await prisma.auxCities.findFirst({
        where: {
          fileName,
        },
        orderBy: {
          lastChecked: "desc",
        },
      });

      if (!auxCities) {
        return null;
      }
      const updateAuxCities = await prisma.auxCities.update({
        where: {
          id: auxCities.id,
        },
        data: {
          lastChecked: new Date().toISOString(),
        },
      });
      return AuxCities.restore({
        fileName: updateAuxCities.fileName,
        lastChecked: updateAuxCities.lastChecked,
      });
    } catch (error) {
      throw new Error(
        "Error fetching the last checked record from aux cities table"
      );
    }
  }
}
