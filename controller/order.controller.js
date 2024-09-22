// const orderModel = require("../models/order.model");
// const productModel = require("../models/product.model");
// const { shippingSchema, increDecreSchema } = require("../validation_schema");
// const { payWithPaystack, paymentStatus } = require("../payments/paystackpay");

// // HANDLE CART APIS
// const getCartItems = async (req, res) => {
//   const userId = req.user;

//   console.log({ userId });

//   const cart = await orderModel
//     .findOne({ purchasedBy: userId, orderStatus: "pending" })
//     .populate("items.id")
//     .exec();

//   return res.send({
//     status: true,
//     data: cart.items,
//     orderId: cart._id,
//     total: cart.totalPrice,
//   });
// };

// const deleteOrderDetails = async (req, res) => {};

// // 1. To Add a new product to cart
// // check if the user has an order in pending [which is the same as cart]
// // if he has, then check if the product is already in the items array before, if yes respond with item already exists, if no, then add the product to the item array, update other attributes like totalPrice, orderDate, etc
// // if he doesn't have a pending order, then create a new order with pending as the status value, with the product as the first item
// // respond with the item and order details for the user

// // 2. To update existing order attributes, we have attributes like orderDates, orderStatus, shipping details, carts etc (3 endpoints, 1 for shipping, 1 for propoerties, one for changing status from pending to processing on checkout - this is best done when doing checkout)
// // check if the product exists, it has to exist, if it doesn't just send a failed response
// // if you update properties like quantityOrdered, then total price must change

// const addToCart = async (req, res) => {
//   // schema pre "save" function handles the update of the totalPrice

//   console.log("add order details...");

//   const userId = req.user;
//   const details = req.params;

//   console.log({ details });

//   if (!details.productId)
//     return res.send({ status: false, message: "define product id!" });

//   const cart = await orderModel.findOne({
//     purchasedBy: userId,
//     orderStatus: "pending",
//   });

//   if (!cart) {
//     console.log("No pending order found, creating a new one...");

//     const newCart = new orderModel({
//       purchasedBy: userId,
//       orderStatus: "pending",
//       order: [{ id: details.productId, quantityOrdered: 1 }],
//     });

//     await newCart.save();

//     console.log({ newCart });

//     return res.send({
//       status: true,
//       message: "order details successfully added for this user",
//       data: newCart,
//     });
//   }

//   const foundProduct = cart.items.filter(
//     (item) => item.id == details.productId
//   );

//   console.log({ foundProduct });

//   if (foundProduct.length > 0)
//     return res.send({
//       status: false,
//       message: "product already exists in cart!",
//     });

//   cart.items.push({ id: details.productId, quantityOrdered: 1 });

//   const product = await productModel.findById(details.productId);
//   const price = cart.totalPrice + product.productPrice;
//   console.log({ price });
//   console.log({ totalPrice: cart.totalPrice });
//   cart.totalPrice = price;

//   await cart.save();

//   return res.send({
//     status: true,
//     message: "order details successfully added for this user",
//     data: cart,
//     total: price,
//   });
// };

// const updateShippingDetails = async (req, res) => {
//   console.log("add shipping details...");
//   // schema pre "save" function handles the update of the totalPrice

//   try {
//     const shippingDetails = await shippingSchema.validateAsync(req.body);
//     console.log({ shippingDetails });

//     const order = await orderModel.findOne({
//       _id: shippingDetails.orderId,
//       orderStatus: "pending",
//     });

//     console.log({ order });

//     if (!order)
//       return res.send({
//         status: false,
//         message: "No order found with this id! or other has been paid for!",
//       });

//     order.shippingDetails.fullName = shippingDetails.fullName;
//     order.shippingDetails.email = shippingDetails.email;
//     order.shippingDetails.street = shippingDetails.street;
//     order.shippingDetails.city = shippingDetails.city;
//     order.shippingDetails.state = shippingDetails.state;
//     order.shippingDetails.zipCode = shippingDetails.zipCode;
//     order.shippingDetails.country = shippingDetails.country;

//     await order.save();

//     const paystack = await payWithPaystack(
//       shippingDetails.email,
//       Math.ceil(order.totalPrice)
//     );

//     console.log({ paystack });

//     if (paystack.status) {
//       order.payment.access_code = paystack.data.access_code;
//       order.payment.reference = paystack.data.reference;
//       await order.save();
//     }

//     return res.send({
//       status: true,
//       data: order.shippingDetails,
//       checkoutStatus: paystack.status,
//       access_code: paystack.data.access_code,
//     });
//   } catch (error) {
//     if (error.isJoi === true)
//       return res.send({
//         status: false,
//         message: error.message || "shipping details in appropriate!",
//       });
//     console.log({ message: error.message });
//     console.log({ error });
//   }
// };

// const incrementAndDecrement = async (req, res) => {
//   console.log("update order details...");

//   let message = "successfully updated product ordered!";

//   const { orderId, productId, newOrderValue } =
//     await increDecreSchema.validateAsync(req.body);

//   const order = await orderModel.findById(orderId).populate("items.id").exec();

//   if (!order)
//     return res.send({ status: false, message: "order does not exist!" });

//   const orderItem = order.items.filter((item) => item.id._id == productId);

//   if (!orderItem.length)
//     return res.send({
//       status: false,
//       message: "product not found in this order/cart!",
//     });

//   const existingQuantity = orderItem[0].id.quantity;

//   let currentQuantity = parseInt(newOrderValue);

//   if (currentQuantity < 1) {
//     currentQuantity = 1;
//     message = "below possible allowable quantity!";
//   }

//   if (currentQuantity > existingQuantity) {
//     currentQuantity = existingQuantity;
//     message = `beyond available quantity, ${existingQuantity}!`;
//   }

//   // console.log({db_q:})

//   console.log({ currentQuantity });

//   console.log({ orderItem: orderItem[0] });

//   // updating the quantity ordered

//   const updated = await order.items.map((item) => {
//     if (item?.id?._id == productId) {
//       console.log({ item });
//       const updatedProduct = {
//         _id: item._id, // this is different from productId and orderId
//         id: productId,
//         quantityOrdered: currentQuantity,
//       };
//       return updatedProduct;
//     }
//     return item;
//   });

//   // calculating total price of items/cart
//   const totalPrice = order.items.reduce((acc, item) => {
//     let mult = 0;
//     if (item.id && item.quantityOrdered) {
//       mult =
//         productId == item.id._id
//           ? currentQuantity * item.id.productPrice
//           : item.quantityOrdered * item.id.productPrice;
//     }

//     console.log({ item });

//     return acc + mult;
//   }, 0);

//   console.log({ totalPrice });

//   try {
//     const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
//       items: updated,
//       totalPrice,
//     });

//     console.log({ updatedOrder });

//     return res.send({
//       status: true,
//       data: order.items,
//       total: totalPrice,
//       message,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.send({ status: false, message: "Could not update order!" });
//   }
// };

// const removeFromCart = async (req, res) => {
//   console.log("remove from cart...");

//   const { orderId, productId } = req.body;

//   console.log(orderId, { productId });

//   const order = await orderModel.findById(orderId).populate("items.id").exec();

//   if (!order)
//     return res.send({ status: false, message: "order does not exist!" });

//   const updatedItems = order.items.filter((item) => item.id._id != productId);

//   // calculating total price of items/cart
//   const totalPrice = order.items.reduce((acc, item) => {
//     let mult = 0;
//     if (item.id && item.quantityOrdered) {
//       mult =
//         productId == item.id._id
//           ? 0
//           : item.quantityOrdered * item.id.productPrice;
//     }

//     console.log({ item });

//     return acc + mult;
//   }, 0);

//   try {
//     const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
//       items: updatedItems,
//       totalPrice,
//     });

//     console.log({ updatedOrder });

//     return res.send({
//       status: true,
//       data: updatedItems,
//       totalPrice,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.send({ status: false, message: "Could not update order!" });
//   }
// };

// const getPaymentStatus = async (req, res) => {
//   console.log("get payment status...");

//   const { orderId } = req.params;

//   const order = await orderModel.findOne({
//     _id: orderId,
//     orderStatus: "pending",
//   });

//   if (!order) res.send({ status: true, message: "Order does not exist!" });

//   console.log({ order });

//   try {
//     const myPayStatus = await paymentStatus(order.payment.reference);
//     console.log({ myPayStatus });

//     if (myPayStatus.data.status === "success") {
//       order.orderStatus = "processing";
//       await order.save();
//       return res.send({
//         status: true,
//         message: "Payment successful!",
//       });
//     }
//   } catch (error) {
//     console.log({ message: error.message });
//     if (error.message === "socket hang up") {
//       return res.send({
//         status: false,
//         message: "Could not reach Paystack server, we'll retry later!",
//       });
//     }
//   }
// };

// module.exports = {
//   getCartItems,
//   addToCart,
//   incrementAndDecrement,
//   updateShippingDetails,
//   removeFromCart,
//   getPaymentStatus,
// };
