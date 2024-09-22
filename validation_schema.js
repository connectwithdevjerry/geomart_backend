// const Joi = require("@hapi/joi");

// const authSchema = Joi.object({
//   email: Joi.string().email().lowercase().required(),
//   password: Joi.string().min(5).required(),
// });
// const signUpSchema = Joi.object({
//   email: Joi.string().email().lowercase().required(),
//   password: Joi.string().min(5).required(),
//   username: Joi.string().required(),
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
// });

// const increDecreSchema = Joi.object({
//   orderId: Joi.string().required(),
//   productId: Joi.string().required(),
//   newOrderValue: Joi.number().required(),
// });

// const forgotPasswordSchema = Joi.object({
//   email: Joi.string().email().lowercase().required(),
// });

// const resetPasswordSchema = Joi.object({
//   token: Joi.string().min(10).required(),
//   newPassword: Joi.string().min(5).required(),
//   cnewPassword: Joi.string().min(5).required(),
// });

// const shippingSchema = Joi.object({
//   orderId: Joi.string().required(),
//   fullName: Joi.string().required(),
//   email: Joi.string().email().required(),
//   street: Joi.string().required(),
//   city: Joi.string().required(),
//   state: Joi.string().required(),
//   zipCode: Joi.string().required(),
//   country: Joi.string().required(),
// });

// const addToCartSchema = Joi.object({
//   productId: Joi.string().required(),
// });

// const ticketSchema = Joi.object({
//   name: Joi.string().required(),
//   message: Joi.string().required(),
//   email: Joi.string().email().required(),
// });

// module.exports = {
//   authSchema,
//   signUpSchema,
//   forgotPasswordSchema,
//   resetPasswordSchema,
//   shippingSchema,
//   addToCartSchema,
//   increDecreSchema,
//   ticketSchema,
// };
