const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin
} = require("../validators/authValidator");

// Register
router.post("/register", validateRegister, registerUser);

// Login
router.post("/login", validateLogin, loginUser);

module.exports = router;