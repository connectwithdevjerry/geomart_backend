const ticketModel = require("../models/ticket.models");
const { ticketSchema } = require("../validation_schema");

const createTicket = async (req, res) => {
  try {
    const ticketDetails = await ticketSchema.validateAsync(req.body);
    
    const ticket = new ticketModel({
      ...ticketDetails,
      status: "pending",
    });

    ticket.save();

    res.send({ status: true, message: "Ticket created successfully" });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }

    return res.send({ status: false, message: "Ticket could not be created!" });
  }
};

module.exports = {
  createTicket,
};
