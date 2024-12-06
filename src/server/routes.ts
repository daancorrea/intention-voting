import { Router } from "express";
import PopulationController from "../api/population/controller";
import VotingController from "../api/voting/controller";
const router = Router();

router.use("/population", PopulationController.getRouter());
router.use("/voting", VotingController.getRouter());
export default router;
