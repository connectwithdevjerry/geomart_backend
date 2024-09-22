// const express = require("express");
// const router = express.Router();

// const {
//   getCartItems,
//   addToCart,
//   incrementAndDecrement,
//   updateShippingDetails,
//   removeFromCart,
//   getPaymentStatus,
// } = require("../controller/order.controller");

// const { verifyAccessToken } = require("../jwt_helpers");

// // cart routes
// router.get("/add-to-cart/:productId", verifyAccessToken, addToCart);
// router.post("/increment-decrement", verifyAccessToken, incrementAndDecrement);
// router.post("/add-shipping-details", verifyAccessToken, updateShippingDetails);
// router.get("/cart-items", verifyAccessToken, getCartItems);
// router.get("/payment-status/:orderId", getPaymentStatus);
// router.post("/get-cart-items", verifyAccessToken, getCartItems);
// router.post(
//   // "/remove-from-cart/:orderId/:productId",
//   "/remove-from-cart",
//   verifyAccessToken,
//   removeFromCart
// );

// module.exports = router;
