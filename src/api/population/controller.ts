import { Request, Response, Router } from "express";
import { PopulationService } from "./service";

const populationService: PopulationService = new PopulationService();
class PopulationController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/update-database/:year",
      this.updateCitiesDatabase.bind(this)
    );
  }

  public getRouter(): Router {
    return this.router;
  }

  private async updateCitiesDatabase(req: Request, res: Response) {
    try {
      const { year } = req.params;
      if (
        !year ||
        isNaN(Number(year)) ||
        Number(year) < 1900 ||
        Number(year) > new Date().getFullYear()
      ) {
        res.status(400).json({
          message:
            "Invalid year. Please provide a valid year between 1900 and the current year.",
        });
        return;
      }
      await populationService.updateDatabase(Number(year));
      res.status(200).json({ message: "Success to update database" });
      return
    } catch (error) {
      res.status(400).json({
        message: "Error to update database",
      });
    }
  }
}
export default new PopulationController();
