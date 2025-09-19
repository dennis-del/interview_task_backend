import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { Event } from "../models/Event";
import { Participant } from "../models/Participant";
import { log } from "console";

// Create Event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventRepo = AppDataSource.getRepository(Event);
    const newEvent = eventRepo.create(req.body);
    console.log(newEvent);
    const saved = await eventRepo.save(newEvent);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Get All Events

export const getEvents = async (req: Request, res: Response) => {
  try {
    const eventRepo = AppDataSource.getRepository(Event);
    const events = await eventRepo.find({ relations: ["eventParticipants"] });

    const today = new Date();

    const eventsWithStatus = events.map((event) => {
      const confirmedCount = event.eventParticipants.filter(
        (p) => p.status === "Confirmed"
      ).length;
      const waitlistCount = event.eventParticipants.filter(
        (p) => p.status === "Waitlist"
      ).length;

      let status = "Open";
      if (new Date(event.date) < today) {
        status = "Expired";
      } else if (confirmedCount >= event.participantLimit) {
        status = "Full";
      }

      return {
        ...event,
        participants: confirmedCount,
        waitlist: waitlistCount,
        status,
      };
    });

    res.json(eventsWithStatus);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err });
  }
};

  
  // Get Single Event
export const getEvent = async (req: Request, res: Response) => {
    try {
      const eventRepo = AppDataSource.getRepository(Event);
      const event = await eventRepo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["eventParticipants"], 
      });
  
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
};
  

// Update Event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventRepo = AppDataSource.getRepository(Event);
    let event = await eventRepo.findOneBy({ id: Number(req.params.id) });

    if (!event) return res.status(404).json({ error: "Event not found" });

    eventRepo.merge(event, req.body);
    const updated = await eventRepo.save(event);
    res.json(updated);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventRepo = AppDataSource.getRepository(Event);
    const result = await eventRepo.delete({ id: Number(req.params.id) });

    if (result.affected === 0) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
