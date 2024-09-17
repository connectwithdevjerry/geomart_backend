const mongoose = require("mongoose");
const productModel = require("./product.model");

// pending for when the cart, processing for after payment,
// shipped for when order has been shipped, delivered for when order
// has been received by customer, cancelled for when order is cancelled by customer
// canceling of order happens before it is shipped i.e at the processing level.
const orderSchema = mongoose.Schema({
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user_collection" },
  items: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "products_collection" },
      quantityOrdered: {
        type: Number,
        min: [1, "quantity ordered cannot be less than 1"],
      },
    },
  ],
  totalPrice: { type: Number },
  orderDate: { type: Date, default: Date.now() },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  shippingDetails: {
    fullName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  payment: {
    access_code: String,
    reference: String,
  },
});

const orderModel = mongoose.model("order_collection", orderSchema);
module.exports = orderModel;
