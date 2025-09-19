import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";

const eventRouter = Router();

eventRouter.post("/", createEvent);

eventRouter.get("/", getEvents);

eventRouter.get("/:id", getEvent);

eventRouter.put("/:id", updateEvent);

eventRouter.delete("/:id", deleteEvent);

export default eventRouter;
