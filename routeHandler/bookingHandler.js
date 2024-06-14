const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bookingSchema = require("../Schemas/bookingSchema");
const eventSchema = require("../Schemas/eventSchema");
const verifyLogin = require("../middlewares/verifyLogin");

const Booking = mongoose.model("Booking", bookingSchema);
const Event = mongoose.model("Event", eventSchema);

// POST: Create a new booking
router.post('/', verifyLogin, async (req, res) => {
    try {
        const { eventId, numberOfTickets } = req.body;
        console.log(req.user)
        const userId = req.user._id;
     
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.bookedTickets + numberOfTickets > event.capacity) {
            return res.status(400).json({ message: "Not enough tickets available" });
        }

        const totalPrice = event.isFree ? 0 : event.price * numberOfTickets;

        const booking = new Booking({
            userId,
            eventId,
            numberOfTickets,
            totalPrice
        });

        await booking.save();

        event.bookedTickets += numberOfTickets;
        await event.save();

        res.status(201).json({
            message: "Booking created successfully",
            result: booking
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

// GET: Retrieve bookings for a specific event
router.get('/event/:eventId', verifyLogin, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const bookings = await Booking.find({ eventId });

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for this event" });
        }

        res.status(200).json({
            message: "Bookings retrieved successfully",
            result: bookings
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

// GET: Retrieve bookings for a specific user
router.get('/user/:userId', verifyLogin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.find({ userId });

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json({
            message: "Bookings retrieved successfully",
            result: bookings
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});
// DELETE: Delete a booking by ID
router.delete('/:bookingId', verifyLogin, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({
            message: "Booking deleted successfully"
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }
});

module.exports = router;
