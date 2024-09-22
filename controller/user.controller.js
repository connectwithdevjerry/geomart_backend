// const userModel = require("../models/user.model");
// const {
//   authSchema,
//   signUpSchema,
//   forgotPasswordSchema,
//   resetPasswordSchema,
// } = require("../validation_schema");
// const createError = require("http-errors");
// const client = require("../init_redis");
// const axios = require("axios");
// const transporter = require("../nodemailerObject");
// const {
//   signAccessToken,
//   signRefreshToken,
//   verifyRefreshToken,
//   signForgotToken,
//   verifyForgotToken,
// } = require("../jwt_helpers");
// const bcrypt = require("bcryptjs");
// require("dotenv").config();
// const { OAuth2Client } = require("google-auth-library");

// // const current_user = new userModel({ _id: id });
// const isAdmin = true;

// // done register/signup
// const createUser = async (req, res, next) => {
//   // also signup, register
//   try {
//     const result = await signUpSchema.validateAsync(req.body);

//     const isUser = await userModel.findOne({ email: result.email });
//     const isUsername = await userModel.findOne({ username: result.username });

//     if (isUser)
//       return res.send({ status: false, message: "Email already exist" });
//     // throw createError.Conflict(`${result.email} is already been registered`);
//     if (isUsername)
//       return res.send({ status: false, message: "username already exist" });

//     const user = new userModel(result);
//     const createdUser = await user.save();

//     const payload = {
//       firstName: createdUser.firstName,
//       lastName: createdUser.lastName,
//       username: createdUser.username,
//       isAdmin: createdUser.isAdmin,
//       isActive: createdUser.isActive,
//       email: createdUser.email,
//       dateCreated: createdUser.dateCreated,
//       dateUpdated: createdUser.dateUpdated,
//       lastLogin: createdUser.lastLogin,
//     };

//     const accessToken = await signAccessToken(createdUser.id, payload);
//     const refreshToken = await signRefreshToken(createdUser.id);
//     console.log({ refreshToken });
//     // res.cookie("refreshToken", refreshToken, {
//     //   httpOnly: true,
//     //   sameSite: "None",
//     //   secure: true,
//     //   maxAge: 24 * 60 * 60 * 1000,
//     // });
//     res.send({ status: true, accessToken, refreshToken });
//   } catch (error) {
//     if (error.isJoi === true) error.status = 422;
//     next(error);
//   }
// };

// const updateUser = (req, res) => {
//   const filter = { _id: req.params.id };
//   const update = req.body;
//   const optns = { new: true };
//   userModel
//     .findOneAndUpdate(filter, update, optns)
//     .then((updatedUser) => {
//       console.log("here's the updated Product ", updatedUser);
//       res.send({
//         status: true,
//         message: "User successfully updated!",
//         data: updatedUser,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send({ status: false, message: "User was not updated!" });
//     });
// };

// // done login/signin
// const getUser = async (req, res, next) => {
//   // also login, signin
//   try {
//     const result = await authSchema.validateAsync(req.body);
//     const user = await userModel.findOne({ email: result.email });
//     if (!user)
//       return res.send({ status: false, message: "User not registered" });

//     const isMatch = await user.isValidPassword(result.password);
//     if (!isMatch)
//       return res.send({
//         status: false,
//         message: "Password not valid",
//       });

//     const payload = {
//       firstName: user.firstName,
//       lastName: user.lastName,
//       username: user.username,
//       isAdmin: user.isAdmin,
//       isActive: user.isActive,
//       email: user.email,
//       dateCreated: user.dateCreated,
//       dateUpdated: user.dateUpdated,
//       lastLogin: user.lastLogin,
//     };

//     const accessToken = await signAccessToken(user.id, payload);
//     const refreshToken = await signRefreshToken(user.id);

//     // res.cookie("refreshToken", refreshToken, {
//     //   httpOnly: true,
//     //   sameSite: "None",
//     //   secure: true,
//     //   maxAge: 24 * 60 * 60 * 1000,
//     // });
//     res.send({ status: true, accessToken, refreshToken });
//   } catch (error) {
//     if (error.isJoi === true)
//       return res.send({ status: false, message: "Invalid Username/Password" });
//     next(error);
//   }
// };

// const refreshToken = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.body;

//     // console.log({ refreshToken });

//     if (!refreshToken) throw createError.BadRequest();
//     const userId = await verifyRefreshToken(refreshToken);

//     const user = await userModel.findById(userId);

//     const payload = {
//       firstName: user.firstName,
//       lastName: user.lastName,
//       username: user.username,
//       isAdmin: user.isAdmin,
//       isActive: user.isActive,
//       email: user.email,
//       dateCreated: user.dateCreated,
//       dateUpdated: user.dateUpdated,
//       lastLogin: user.lastLogin,
//     };

//     const accessToken = await signAccessToken(userId, payload);
//     const refToken = await signRefreshToken(userId);
//     // res.cookie("refreshToken", refreshToken, {
//     //   httpOnly: true,
//     //   sameSite: "None",
//     //   secure: true,
//     //   maxAge: 24 * 60 * 60 * 1000,
//     // });
//     res.send({ accessToken: accessToken, refreshToken: refToken });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteUser = (req, res) => {
//   const filter = { _id: req.params.id };
//   userModel
//     .deleteOne(filter)
//     .then((user) => {
//       console.log({ user });
//       res.send({ status: true, message: "User sucessfully deleted!" });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send({ status: false, message: "Could not delete User!" });
//     });
//   // console.log(req.body);
// };

// const createUsers = (req, res) => {
//   if (isAdmin) {
//     userModel
//       .create(req.body.users)
//       .then(() => {
//         res.send({
//           status: true,
//           message: "All users successfully created!",
//         });
//       })
//       .catch(() => {
//         res.send({ status: false, message: "Failed to create users!" });
//       });
//   } else {
//     res.send({
//       status: false,
//       message: "you're not authorized to perform this operation!",
//     });
//   }
// };

// const updateUsers = (req, res) => {
//   if (isAdmin) {
//     const filter = { _id: req.params.id };

//     userModel
//       .updateOne(filter, req.body)
//       .then(() => {
//         res.send({ status: true, message: "User successfully updated!" });
//       })

//       .catch((err) => {
//         console.log(err);
//         res.send({ status: false, message: "Could not update User!" });
//       });
//   } else {
//     res.send({
//       status: false,
//       message: "you're not authorized to perform this operation!",
//     });
//   }
// };

// const getUsers = (req, res) => {
//   userModel
//     .find({})
//     .then((users) => {
//       res.send({ status: true, data: users });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send({ status: false, message: "Could not fetch users!" });
//     });
// };

// const deleteUsers = (req, res) => {
//   if (isAdmin) {
//     const filter = { _id: req.params.id };
//     userModel
//       .deleteOne(filter)
//       .then(() => {
//         res.send({ status: true, message: "User successfully deleted!" });
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send({ status: false, message: "Could not delete User!" });
//       });
//   } else {
//     res.send({
//       status: false,
//       message: "you're not authorized to perform this operation!",
//     });
//   }
// };

// const logOut = async (req, res, next) => {
//   try {
//     // const { refreshToken } = req.body;
//     const refreshToken = req.cookies?.refreshToken;
//     if (!refreshToken) throw createError.BadRequest();
//     const userId = await verifyRefreshToken(refreshToken);
//     console.log({ userId });
//     client.DEL(userId, (err, val) => {
//       if (err) {
//         console.log(err.message);
//         throw createError.InternalServerError();
//       }
//       console.log(val);
//       res.clearCookie("refreshToken", {
//         httpOnly: true,
//         sameSite: "None",
//         secure: true,
//       });
//       res.sendStatus(204);
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // GOOGLE AUTHENTICATION

// const getUserData = async (access_token) => {
//   await axios
//     .get(
//       `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
//     )
//     .then((res) => {
//       console.log(res.data);
//     });
// };

// const handleGoogleReq = (req, res) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Referrer-Policy", "no-referrer-when-downgrade");
//   const redirectURL = "http://localhost:5000/user/google/oauth";

//   const oAuth2Client = new OAuth2Client(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     redirectURL
//   );

//   // Generate the url that will be used for the consent dialog.
//   const authorizeUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: "https://www.googleapis.com/auth/userinfo.profile  openid ",
//     prompt: "consent",
//   });

//   res.json({ status: true, url: authorizeUrl });
// };

// const handleGoogleAuth = async (req, res) => {
//   const code = req.query.code;
//   console.log({ code });

//   try {
//     const redirectURL = "http://localhost:5000/user/google/oauth";

//     const oAuth2Client = new OAuth2Client(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       redirectURL
//     );

//     console.log("oAuth2Client created...");
//     const r = await oAuth2Client.getToken(code);

//     await oAuth2Client.setCredentials(r.tokens);

//     const user = oAuth2Client.credentials;
//     console.log({ credentials: user });

//     await getUserData(oAuth2Client.credentials.access_token);
//   } catch {
//     console.log("Error logging in with OAuth2 user");
//   }

//   res.redirect(303, "http://localhost:5173/");
// };

// // RESET PASSWORD
// const forgotPassword = async (req, res) => {
//   try {
//     const result = await forgotPasswordSchema.validateAsync(req.body);
//     const email = result.email;
//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.send({ status: false, message: "User not found" });
//     }
//     const token = await signForgotToken(email);
//     const reset_link = `${process.env.FRONTEND_URL}/resetpassword/${token}`;
//     console.log({ token, reset_link });

//     let mailOptions = {
//       from: process.env.MY_EMAIL_USER,
//       to: email,
//       subject: "Password Reset Link",
//       text: `Your reset link: ${reset_link}`,
//     };

//     // await transporter.sendMail(mailOptions);
//     // , (error, info) => {
//     //   if (error) {
//     //     console.log({ error });
//     //     return res.send({ status: false, message: "Failed to send email" });
//     //   }
//     //   console.log("Email sent: " + info.response);
//     //   res.send({ status: true, message: "Email sent successfully" });
//     // }

//     return res.send({
//       status: true,
//       message: "Reset Link successfully sent to your mail!",
//     });
//   } catch (error) {
//     if (error.isJoi === true)
//       return res.send({
//         status: false,
//         message: "Kindly provide a valid email",
//       });

//     console.log(error);
//   }
// };

// // HANDLE RESET PASSWORD
// const handleResetPassword = async (req, res) => {
//   const { newPassword, cnewPassword, token } =
//     await resetPasswordSchema.validateAsync(req.body);

//   if (newPassword !== cnewPassword)
//     return res.send({ status: false, message: "Passwords do not match!" });

//   try {
//     const decoded = await verifyForgotToken(token);
//     const user = await userModel.findOne({ email: decoded });

//     // const password = await user.passwordResetHash(newPassword);

//     if (!user)
//       return res.send({ status: false, message: "Link does not exist!" });

//     user.password = newPassword;

//     await user.save();

//     res.send({ status: true, message: "Password updated successfully" });
//   } catch (error) {
//     console.log(error);
//     res.send({ status: false, message: error.message });
//   }
// };

// module.exports = {
//   createUser,
//   updateUser,
//   getUser,
//   deleteUser,
//   createUsers,
//   updateUsers,
//   getUsers,
//   deleteUsers,
//   refreshToken,
//   logOut,
//   handleGoogleAuth,
//   handleGoogleReq,
//   forgotPassword,
//   handleResetPassword,
// };
