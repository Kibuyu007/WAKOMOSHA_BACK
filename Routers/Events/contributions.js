import express from "express";
import { 
  eventsSummary,
  getEventContributions,
  saveContribution, 
} from "../../Controlers/Events/contributions.js";

const router = express.Router();

router.get("/getMchango/:eventId", getEventContributions);
router.post("/addMchango", saveContribution);
router.get("/eventsSummary",eventsSummary)

export default router;
