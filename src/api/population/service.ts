import { AuxCitiesService } from "../auxCities/service";
import { Population } from "../entities/population";
import { IBGEGateway } from "../gateway/ibge.gateway";
import { extractDataFromPdf, parsePdfMetadataToString } from "../../utils/pdf";
import { PopulationRepository } from "./repository";

const populationRepository: PopulationRepository = new PopulationRepository();
const iBGEGateway: IBGEGateway = new IBGEGateway();
const auxCitiesService: AuxCitiesService = new AuxCitiesService();
export class PopulationService {
  async updateDatabase(year: number) {
    const htmlContent = await iBGEGateway.getHTMLContent(year);
    const pdfRegex = new RegExp(`href="([^"]*POP${year}_\\d+\\.pdf)"`, "i");
    const match = pdfRegex.exec(htmlContent);
    if (!match) {
      throw new Error("PDF file name do not be find");
    }
    const fileName = match[1];
    const pdfBuffer = await iBGEGateway.getBufferFromIBGE(
      `${year}/${fileName}`
    );
    const auxCities = await auxCitiesService.getLastChecked(fileName);
    if (auxCities) {
      return {
        message: "Database already be updated",
        date: auxCities.getLastChecked(),
      };
    }
    const pdfText = await parsePdfMetadataToString(pdfBuffer);
    const extractDataCitiesArr = extractDataFromPdf(pdfText);
    await Promise.all([
      extractDataCitiesArr.map(async (data) => {
        const { cityName, population: populationNum, state } = data;
        const updateFirst = await populationRepository.findOneAndUpdate(
          cityName,
          populationNum
        );
        if (updateFirst) {
          return;
        }
        const population = Population.create({
          cityName,
          population: populationNum,
          state,
          year,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await populationRepository.create(population);
      }),
      await auxCitiesService.create({
        fileName,
        lastChecked: new Date().toISOString(),
      }),
    ]);
    return;
  }

  async getByCityAndState(
    cityName: string,
    state: string
  ): Promise<Population | null> {
    return await populationRepository.getByCityAndState(cityName, state);
  }
}
