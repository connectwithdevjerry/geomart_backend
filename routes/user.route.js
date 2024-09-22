// const express = require("express");
// const router = express.Router();
// const {
//   getUser,
//   getUsers,
//   createUser,
//   createUsers,
//   updateUser,
//   updateUsers,
//   deleteUser,
//   deleteUsers,
//   refreshToken,
//   logOut,
//   handleGoogleAuth,
//   handleGoogleReq,
//   forgotPassword,
//   handleResetPassword,
//   getOrderDetails,
//   updateOrderDetails,
//   addOrderDetails,
// } = require("../controller/user.controller");
// const { verifyAccessToken } = require("../jwt_helpers");

// router.get("/get_users", getUsers);
// router.post("/refresh_token", refreshToken);
// router.post("/google/request", handleGoogleReq);
// router.get("/google/oauth", handleGoogleAuth);
// router.post("/logout", logOut);
// router.post("/get_user", getUser);
// router.post("/create_users", createUsers);
// router.post("/create_user", createUser);
// router.put("/update_users", updateUsers);
// router.put("/update_users/:id", updateUser);
// router.delete("/delete_users", verifyAccessToken, deleteUsers);
// router.delete("/delete_users/:id", verifyAccessToken, deleteUser);

// router.post("/forgotpassword", forgotPassword);
// router.post("/resetpassword", handleResetPassword);

// module.exports = router;
