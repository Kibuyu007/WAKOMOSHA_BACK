import express from "express";
import { 
  getEventContributions, 
  setPromisedAmount, 
  addPaidAmount 
} from "../../Controlers/Events/contributions.js";

const router = express.Router();

router.get("/event/:eventId",  getEventContributions);
router.post("/setPromised",  setPromisedAmount);
router.post("/addAmount",  addPaidAmount);

export default router;
