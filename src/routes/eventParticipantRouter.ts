// src/routes/EventParticipantRouter.ts
import { Router } from "express";
import { registerParticipant, getUserRegistrations } from "../controllers/EventParticipantController";

const router = Router();


router.post("/register", registerParticipant);

router.get("/registrations/:email", getUserRegistrations);

export default router;
