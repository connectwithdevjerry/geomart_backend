const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { verifyAccessToken } = require("./jwt_helpers");
const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/products.route");
const orderRoutes = require("./routes/order.route");
const ticketRoutes = require("./routes/ticket.route");
const rateLimit = require("./rate-limit");
const { uploadImage } = require("./controller/product.controller");

const app = express();
require("dotenv").config();

app.use(rateLimit);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const URI = process.env.MONGODB_URI;
mongoose
  .connect(URI)
  .then(() => {
    console.log("mongodb connected successfully!");
  })
  .catch((err) => {
    console.log("mongodb could not connect, try again", err);
  });

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/ticket", ticketRoutes);

const PORT = 5000;

app.get("/", verifyAccessToken, (req, res) => {
  res.send("homepage");
});

app.post("/uploadimage", uploadImage);

app.listen(PORT, (err) => {
  if (err) {
    console.log("server error", err);
  } else {
    console.log(`check running server on url http://localhost:${PORT}`);
  }
});
