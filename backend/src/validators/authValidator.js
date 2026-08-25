const validator = require("validator");

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({
      message: "Name must be at least 2 characters"
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Please provide a valid email"
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }

  next();
};


const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Please provide a valid email"
    });
  }

  next();
};


module.exports = {
  validateRegister,
  validateLogin
};