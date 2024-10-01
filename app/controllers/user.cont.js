const { User } = require("../models");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");

module.exports = {
  // Render login page with an optional errorMessage
  index: (req, res) => {
    res.render("login", { errorMessage: req.flash("error") });
  },

  // Render register page
  indexRegister: (req, res) => {
    res.render("register", { errorMessage: req.flash("error") });
  },
  // Render forgot password page
indexForgotPassword: (req, res) => {
    res.render("forgot-password", { errorMessage: req.flash("error"), infoMessage: req.flash("info") });
  },
  

  // Login logic
  login: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/user/login");
      }

      // Optional: Check if the provided name matches the stored name
      if (name && user.name !== name) {
        req.flash("error", "Name does not match.");
        return res.redirect("/user/login");
      }

      // Compare password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {   
        req.flash("error", "Invalid email or password.");
        return res.redirect("/user/login");
      }

      // If login is successful, store user in session and redirect
      req.session.user = user;
      res.redirect("/");

    } catch (error) {
      console.error("Error during login:", error);
      req.flash("error", "Server error.");
      res.redirect("/user/login");
    }
  },

  // Register logic
  register: async (req, res) => {
    const { name, email, password, confirm_password } = req.body; 

    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        req.flash("error", "Email is already registered.");
        return res.redirect("/user/register");
      }
      if (password !== confirm_password) {
        req.flash("error", "Passwords do not match.");
        return res.redirect("/user/register");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user into the database
      await User.create({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),  // Setting createdAt manually, Sequelize should do this automatically
        updatedAt: new Date(),  // Setting updatedAt manually, Sequelize should do this automatically
      });

      // Redirect to login after successful registration
      res.redirect("/user/login");

    } catch (error) {
      console.error("Error during registration:", error);
      req.flash("error", "Server error during registration.");
      res.redirect("/user/register");
    }
  },


  // Forgot password logic
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash("error", "Email not found.");
        return res.redirect("/user/forgot-password"); // Make sure this route exists
      }

      // Generate a verification token
      const token = crypto.randomBytes(20).toString('hex');

      // Here, you might want to store the token and its expiration in the database
      // For simplicity, let's assume you have a User model that can store it
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Configure nodemailer
      const transporter = nodemailer.createTransport({
        service: "Gmail", // Use your email service provider
        auth: {
          user: "kimanonuevo59@gmail.com", // Your email
          pass: "oqbt elyt sjqv tvif", // Your email password or app password
        },
      });

      const mailOptions = {
        to: user.email,
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://localhost:8080/user/forgot-password/${token}\n\n` + // Update with your reset password route
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      req.flash("info", "An email has been sent to " + user.email + " with further instructions.");
      res.redirect("/user/login"); // Redirect to login or wherever you want

    } catch (error) {
      console.error("Error during forgot password:", error);
      req.flash("error", "Server error during password reset.");
      res.redirect("/user/forgot-password"); // Make sure this route exists
    }
  },
  // Password reset form rendering based on token
  renderResetPasswordPage: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { [Op.gt]: Date.now() }, // Check if the token is still valid
        },
      });

      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/user/forgot-password");
      }

      // Render password reset form
      res.render("reset-password", { token: req.params.token });
    } catch (error) {
      console.error("Error rendering reset password page:", error);
      req.flash("error", "Server error.");
      res.redirect("/user/forgot-password");
    }
  },

  // Password reset logic
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password, confirm_password } = req.body;

    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, // Token should not be expired
        },
      });

      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/user/forgot-password");
      }

      // Check if passwords match
      if (password !== confirm_password) {
        req.flash("error", "Passwords do not match.");
        return res.redirect(`/user/forgot-password/${token}`);
      }

      // Hash the new password and save it
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = null;  // Clear the token
      user.resetPasswordExpires = null;  // Clear the expiration time
      await user.save();

      req.flash("info", "Password has been reset successfully.");
      res.redirect("/user/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      req.flash("error", "Server error during password reset.");
      res.redirect("/user/forgot-password");
    }
  },
};
