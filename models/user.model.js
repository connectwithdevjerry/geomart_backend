// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = mongoose.Schema({
//   firstName: { type: String, required: false },
//   lastName: { type: String, required: false },
//   username: { type: String, required: false, lowercase: true },
//   isAdmin: { type: Boolean, default: false },
//   isActive: { type: Boolean, default: false },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: false },
//   dateCreated: { type: Date, immutable: true, default: () => Date.now() },
//   dateUpdated: { type: Date, default: () => Date.now() },
//   lastLogin: { type: Date, default: () => Date.now() },
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     zipCode: String,
//     country: String,
//   },
// });

// // Hashing the password before saving to the database
// userSchema.pre("save", function (next) {
//   bcrypt.hash(this.password, 10, (err, hash) => {
//     if (err) {
//       console.log({ err });
//     } else {
//       this.password = hash;
//     }
//     next();
//   });
// });

// userSchema.methods.isValidPassword = async function (password) {
//   if (!this.password || !password) return false;

//   try {
//     const isValid = await bcrypt.compare(password, this.password);
//     return isValid;
//   } catch (error) {
//     throw error;
//   }
// };

// userSchema.methods.passwordResetHash = async (password) => {
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     return hashed;
//   } catch (err) {
//     console.error({ err });
//     return false;
//   }
// };

// const userModel = mongoose.model("user_collection", userSchema);
// module.exports = userModel;
