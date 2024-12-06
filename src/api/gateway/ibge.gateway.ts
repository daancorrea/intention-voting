import axios, { AxiosInstance } from "axios";
import { ibge_api } from "../../infra/envConfig";
import pdfParse from "pdf-parse";

export class IBGEGateway {
  async getHTMLContent(year: number = new Date().getFullYear()): Promise<string> {
    try {
      const url = `${ibge_api}${year}/`;
      const response = await axios.get<string>(url);
      return response.data;
    } catch (error) {
      throw new Error("Page not Found");
    }
  }

  async getBufferFromIBGE(path: string): Promise<Buffer> {
    const url = `${ibge_api}${path}`;
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });
    return response.data as Buffer;
  }

  async getPDFMetadata(year: number = new Date().getFullYear()): Promise<any> {
    try {
      const url = `${ibge_api}${year}/`;
      const response = await axios.get<string>(url);
      const htmlContent = response.data;
      const pdfRegex = new RegExp(`href="([^"]*POP${year}_\\d+\\.pdf)"`, "i");
      const match = pdfRegex.exec(htmlContent);
      if (!match) {
        throw new Error("Arquivo PDF não encontrado no HTML.");
      }
      const pdfUrl = `${ibge_api}${year}/${match[1]}`;
      const pdfResponse = await axios.get<ArrayBuffer>(pdfUrl, {
        responseType: "arraybuffer",
      });
      const pdfData = await pdfParse(pdfResponse.data as Buffer);
      const imageData = this.extractDataFromPDF(pdfData.text);
      return imageData;
    } catch (error) {
      throw new Error("Erro ao processar dados do PDF.");
    }
  }

  private extractDataFromPDF(pdfText: string): any {
    const citiesData: {
      UF: string;
      codigoMunicipio: string;
      nomeMunicipio: string;
      populacao: number;
    }[] = [];
    const cityRegex = /([A-Z]{2})(\d{7})([^\d]+?)(\d[\d\.]*)\s*$/gm;
    let match;
    while ((match = cityRegex.exec(pdfText)) !== null) {
      const [_, UF, codigoMunicipio, nomeMunicipio, populacaoStr] = match;
      citiesData.push({
        UF,
        codigoMunicipio,
        nomeMunicipio: nomeMunicipio.trim(),
        populacao: parseInt(populacaoStr.replace(/\./g, ""), 10),
      });
    }
    return citiesData;
  }
}
