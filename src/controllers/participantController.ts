import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { Participant } from "../models/Participant";
import { Event } from "../models/Event";

// Get participants of an event
export const getParticipants = async (req: Request, res: Response) => {
  try {
    const participantRepo = AppDataSource.getRepository(Participant);
    const participants = await participantRepo.find({
      where: { event: { id: Number(req.params.eventId) } },
    });
    res.json(participants);
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

// Bulk update participant status
export const bulkUpdateStatus = async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body; // ids: number[], status: "Confirmed" | "Waitlist"
    const participantRepo = AppDataSource.getRepository(Participant);

    await participantRepo
      .createQueryBuilder()
      .update(Participant)
      .set({ status })
      .whereInIds(ids)
      .execute();

    res.json({ message: "Participants updated" });
  } catch (err) {
    console.error("Error updating participants:", err);
    res.status(500).json({ error: "Failed to update participants" });
  }
};
