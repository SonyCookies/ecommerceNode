
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.cont");
//ito ay route sa login
router.get("/login", UserController.index); 
router.post("/login", UserController.login); 
//ito ay sa pagregister sa user
router.get("/register", UserController.indexRegister);
router.post("/register", UserController.register);
//ito ay sa forgot password
router.get("/forgot-password", UserController.indexForgotPassword);
router.post("/forgot-password", UserController.forgotPassword);
// Password reset form
router.get("/forgot-password/:token", UserController.renderResetPasswordPage);
// Password reset logic
router.post("/forgot-password/:token", UserController.resetPassword);


module.exports = router;
