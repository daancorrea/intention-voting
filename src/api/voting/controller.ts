import { Request, Response, Router } from "express";
import { VotingService } from "./service";
import multer from "multer";

class VotingController {
  private router: Router;
  private votingService: VotingService;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
    this.votingService = new VotingService();
  }

  private initializeRoutes() {
    const upload = multer({ dest: "uploads/" });
    this.router.post(
      "/intentions",
      upload.single("file"),
      this.handleFileUpload.bind(this)
    );
    this.router.get("/result/:searchId", this.votingResult.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async handleFileUpload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).send({ error: "No file uploaded" });
      return;
    }
    const filePath = req.file.path;
    const result = await this.votingService.handleFileUpload(filePath);
    res.status(200).send(result);
  }

  private async votingResult(req: Request, res: Response): Promise<void> {
    const { searchId } = req.params;
    const result = await this.votingService.makeResultBySearchId(searchId);
    res.status(200).send(result);
  }
}

export default new VotingController();
