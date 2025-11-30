import express from "express";
import { closeEvent, createEvent, getAllEvents, getOpenEvents, updateEvent } from "../../Controlers/Events/events.js";
import { verifyUser } from "../../Middleware/verifyToken.js";


const router = express.Router();

router.post("/addEvent",verifyUser, createEvent);
router.get("/openEvent", getOpenEvents);
router.get("/getEvents", getAllEvents);
router.put("/editEvent/:id", updateEvent);
router.put("/closeEvent/:id", closeEvent);


export default router;