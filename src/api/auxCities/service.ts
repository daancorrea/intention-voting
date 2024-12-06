import { AuxCities } from "../entities/auxCities";
import { AuxCitiesRespository } from "./repository";


const auxCitiesRepository = new AuxCitiesRespository()
export class AuxCitiesService {
  async create(params: { fileName: string; lastChecked: string }) {
    const auxCities = AuxCities.create({
      fileName: params.fileName,
      lastChecked: params.lastChecked,
    });
    await auxCitiesRepository.create(auxCities);
  }

  async getLastChecked(fileName: string) {
    return await auxCitiesRepository.getLastChecked(fileName);
  }
}
