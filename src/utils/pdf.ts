import pdfParse from "pdf-parse";

export const parsePdfMetadataToString = async (
  buffer: Buffer
): Promise<string> => {
  return (await pdfParse(buffer)).text;
};

interface IOutput {
  state: string;
  cityName: string;
  population: number;
}
export const extractDataFromPdf = (pdfText: string): IOutput[] => {
  const citiesData: {
    state: string;
    codigoMunicipio: string;
    cityName: string;
    population: number;
  }[] = [];
  const cityRegex = /([A-Z]{2})(\d{7})([^\d]+?)(\d[\d\.]*)\s*$/gm;
  let match;
  while ((match = cityRegex.exec(pdfText)) !== null) {
    const [_, state, codigoMunicipio, cityName, populationStr] = match;
    citiesData.push({
      state,
      codigoMunicipio,
      cityName: cityName.trim(),
      population: parseInt(populationStr.replace(/\./g, ""), 10),
    });
  }
  return citiesData;
};
