const mongoose = require("mongoose");
const eventSchema = mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: function() {
        return !this.isFree;
      }
    },
    capacity: {
      type: Number,
      required: true
    },
    bookedTickets: {
      type: Number,
      default: 0
    },
    isFree: {
      type: Boolean,
      required: true
    }
  }
  )



module.exports = eventSchema