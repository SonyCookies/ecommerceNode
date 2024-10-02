const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.cont");

router.get("/login", UserController.index); 
router.post("/login", UserController.login); 
router.get("/register", UserController.indexRegister);
router.post("/register", UserController.register);
router.get("/forgot-password", UserController.indexForgotPassword);
router.post("/forgot-password", UserController.forgotPassword);
router.get("/forgot-password/:token", UserController.renderResetPasswordPage);
router.post("/forgot-password/:token", UserController.resetPassword);

module.exports = router;
