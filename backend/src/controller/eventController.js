import { asyncHandler } from "../utils/asyn-handler.js";
import Event from "../models/Event.js";

const createEvent = asyncHandler(async (req, res) => {
    const { name, description, date, venue, category, bannerImage } = req.body;
    const createdBy = req.user.id;

    if (!name || !date) {
        return res.status(400).json({ success: false, message: "Name and date are required." });
    }

    const event = await Event.create({
        name,
        description,
        date,
        venue,
        category,
        bannerImage,
        createdBy,
    });

    res.status(201).json({ success: true, message: "Event created", data: event });
});

const updateEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const { name, description, date, venue, category, bannerImage } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.createdBy !== req.user.id) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this event." });
    }

    Object.assign(event, { name, description, date, venue, category, bannerImage });
    await event.save();

    res.status(200).json({ success: true, message: "Event updated", data: event });
});

const deleteEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
        return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.createdBy !== req.user.id) {
        return res.status(403).json({ success: false, message: "Unauthorized to delete this event." });
    }

    await Event.deleteById(eventId);
    res.status(200).json({ success: true, message: "Event deleted" });
});

const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.findAll();
    res.status(200).json({ success: true, data: events });
});

const getMyEvents = asyncHandler(async (req, res) => {
    const events = await Event.findByUser(req.user.id);
    res.status(200).json({ success: true, data: events });
});

export { createEvent, updateEvent, deleteEvent, getEvents, getMyEvents };
