import { Router } from "express";
import {
  getParticipants,
  bulkUpdateStatus,
} from "../controllers/participantController";

const participantRouter = Router();

participantRouter.get("/:eventId", getParticipants);

participantRouter.put("/bulk-update", bulkUpdateStatus);

export default participantRouter;
