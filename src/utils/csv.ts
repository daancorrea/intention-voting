import * as fs from "fs";
import csvParser from "csv-parser";
import iconv from "iconv-lite";
import moment from "moment";

interface IResult {
  searchId: string;
  searchDate: Date;
  state: string;
  city: string;
  votingIntention: string;
}

export const extractCSVData = async (filePath: string): Promise<IResult[]> => {
  const requiredColumns = ["ID_PESQUISA", "DATA_PESQUISA", "MUNICÍPIO", "ESTADO", "INTENÇÃO DE VOTO"];
  const results: IResult[] = [];

  return new Promise((resolve, reject) => {
    let validated = false; 
    let missingColumns: string[] = [];

    fs.createReadStream(filePath)
      .pipe(iconv.decodeStream("latin1"))
      .pipe(
        csvParser({
          separator: ";",
        })
      )
      .on("headers", (headers) => {
        missingColumns = requiredColumns.filter((col) => !headers.includes(col));
        if (missingColumns.length > 0) {
          reject(
            new Error(
              `CSV file is missing the following required columns: ${missingColumns.join(", ")}`
            )
          );
        }
        validated = true; 
      })
      .on("data", (data) => {
        try {
          if (!validated) {
            throw new Error("Validation was not performed before processing data.");
          }

          const parsedDate = moment(data["DATA_PESQUISA"], "DD/MM/YYYY", true);
          if (!parsedDate.isValid()) {
            throw new Error(`Invalid date format: ${data["DATA_PESQUISA"]}`);
          }

          const obj: IResult = {
            searchId: data["ID_PESQUISA"],
            searchDate: parsedDate.toDate(),
            city: data["MUNICÍPIO"],
            state: data["ESTADO"],
            votingIntention: data["INTENÇÃO DE VOTO"],
          };
          results.push(obj);
        } catch (err) {
          console.error("Error processing row:", err);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
        console.error("Error reading the file:", err);
      });
  });
};
