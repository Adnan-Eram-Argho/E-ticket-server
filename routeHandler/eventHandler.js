const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const eventSchema = require("../Schemas/eventSchema");
const verifyLogin = require("../middlewares/verifyLogin")
const Event = new mongoose.model("Event",eventSchema);
//post all the users
router.post('/all', async (req, res) => {
    try {
      const events = req.body;
  
      if (!Array.isArray(events)) {
        return res.status(400).json({ message: "Input should be an array of events" });
      }
  
      const createdEvents = await Event.insertMany(events);
      res.status(201).json(createdEvents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


//get all events
  router.get('/', async (req, res) => {
    try {
        const data = await Event.find();
        res.status(200).json({
            message: "Events retrieved successfully",
            result: data
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: "There was an error",
            details: err.message
        });
    }


    // GET: Retrieve a specific event by ID
router.get('/:id', verifyLogin, async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({
          message: "Event retrieved successfully",
          result: event
      });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({
          error: "There was an error",
          details: err.message
      });
  }
});

// PATCH: Update an event by ID
router.patch('/:id', verifyLogin, async (req, res) => {
  try {
      const eventId = req.params.id;
      const updates = req.body;

      const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
          new: true, // Return the updated document
          runValidators: true // Ensure the updates adhere to the schema
      });

      if (!updatedEvent) {
          return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json({
          message: "Event updated successfully",
          data: updatedEvent
      });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({
          error: "There was an error",
          details: err.message
      });
  }
});

// DELETE: Delete an event by ID
router.delete('/:id', verifyLogin, async (req, res) => {
  try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({
          message: "Event deleted successfully",
          result: event
      });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({
          error: "There was an error",
          details: err.message
      });
  }
});
});
module.exports = router;
