import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { Participant } from "../models/Participant";
import { Event } from "../models/Event";

// Register a participant to an event
export const registerParticipant = async (req: Request, res: Response) => {
    try {
      const { name, email, eventId } = req.body;
  
      const eventRepo = AppDataSource.getRepository(Event);
      const participantRepo = AppDataSource.getRepository(Participant);
  
      // Check if user is already registered for this event
      const existingRegistration = await participantRepo.findOne({
        where: { email, eventId }, // 🔹 Use eventId directly
      });
  
      if (existingRegistration) {
        return res.status(400).json({ message: "You are already registered for this event" });
      }
  
      // Get event without relations to avoid TypeORM sync issues
      const event = await eventRepo.findOne({
        where: { id: eventId },
      });
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Get participant count separately
      const confirmedCount = await participantRepo.count({
        where: { eventId, status: "Confirmed" }
      });
      
      let participantStatus: "Confirmed" | "Waitlist" = "Confirmed";
      
      if (confirmedCount >= event.participantLimit) {
        participantStatus = "Waitlist";
      }
      
      // 🔹 Create participant with explicit eventId - NO RELATION OBJECT
      const participant = participantRepo.create({
        name,
        email,
        eventId, // 🔹 Only set the ID, not the relation object
        status: participantStatus,
      });
      
      const savedParticipant = await participantRepo.save(participant);

      // 🔹 Update event counts manually using query builder to avoid relation issues
      if (participantStatus === "Confirmed") {
        await eventRepo
          .createQueryBuilder()
          .update(Event)
          .set({ participants: () => "participants + 1" })
          .where("id = :id", { id: eventId })
          .execute();
      } else {
        await eventRepo
          .createQueryBuilder()
          .update(Event)
          .set({ waitlist: () => "waitlist + 1" })
          .where("id = :id", { id: eventId })
          .execute();
      }

      console.log("Created participant:", savedParticipant); // 🔹 Debug log

      return res.status(201).json({ 
        message: participantStatus === "Confirmed" ? "Registered successfully" : "Added to waitlist", 
        participant: {
          id: savedParticipant.id,
          name: savedParticipant.name,
          email: savedParticipant.email,
          status: savedParticipant.status,
          eventId: savedParticipant.eventId, // 🔹 Make sure eventId is returned
          createdAt: savedParticipant.createdAt,
          updatedAt: savedParticipant.updatedAt,
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

// Get all registrations for a user by email
export const getUserRegistrations = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const participantRepo = AppDataSource.getRepository(Participant);

    const registrations = await participantRepo.find({
      where: { email },
      relations: ["event"], // ✅ load the event relation
      order: { createdAt: "DESC" },
    });

    console.log("Raw registrations from DB:", registrations); // 🔹 Debug log

    const result = registrations
      .filter((reg) => reg.event) // ✅ skip null events
      .map((reg) => ({
        id: reg.id,
        status: reg.status,
        registeredAt: reg.createdAt,
        event: {
          id: reg.event.id,
          title: reg.event.title,
          date: reg.event.date,
          time: reg.event.time,
          venue: reg.event.venue,
          organiser: reg.event.organiser,
        },
      }));

    console.log("Returning registrations for", email, ":", result); // 🔹 Debug log

    res.json(result);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};