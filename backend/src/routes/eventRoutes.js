import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createEvent, updateEvent, deleteEvent, getEvents, getMyEvents } from "../controller/eventController.js";

const router = Router();

router.get("/", getEvents);
router.get("/mine", verifyJWT, getMyEvents);
router.post("/", verifyJWT, createEvent);
router.put("/:id", verifyJWT, updateEvent);
router.delete("/:id", verifyJWT, deleteEvent);

export default router;
