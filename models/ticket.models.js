const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  dateAdded: { type: String, immutable: true, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "resolved", "in-progress"],
    default: "pending",
  },
});

const TicketModel = mongoose.model("tickets_collection", TicketSchema);
module.exports = TicketModel;
