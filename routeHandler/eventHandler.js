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
  router.get('/',verifyLogin, async (req, res) => {
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
});
module.exports = router;
