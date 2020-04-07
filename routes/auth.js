const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetPasswordEmail } = require("../utils/sendEmail");

// Login
router.post("/login", async (req, res) => {
  // Validating before login
  const { error } = loginValidation(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.status(400).json({ error: { message: errMessage } });
  }

  const generic_error = { error: { message: "Email or password are invalid" } };

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json(generic_error);

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordValid) return res.status(400).json(generic_error);

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_ADDITION);
    return res
      .status(200)
      .json({ userId: user._id, userName: user.userName, authToken: token });
  } catch (err) {
    return res
      .status(400)
      .json({ error: { message: err.message, stack: err.stack } });
  }
});

// Registers a new user
router.post("/register", async (req, res) => {
  // Validating before register
  const { error } = registerValidation(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.status(400).json({ error: { message: errMessage } });
  }

  // Checking if the user already exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res
      .status(400)
      .json({ error: { message: "Email already registered" } });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const newUser = new User({
    userName: req.body.userName,
    password: hashedPassword,
    email: req.body.email,
  });

  try {
    await newUser.save();
    return res.status(200).json("Registered successfuly!");
  } catch (err) {
    return res
      .status(400)
      .json({ error: { message: err.message, stack: err.stack } });
  }
});

// Verify user exists (forgot password?)
router.post("/reset_password/send", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const resetToken = jwt.sign(
        { _id: user._id, extra: user.password },
        process.env.TOKEN_ADDITION
      ); // previous password used so the reset token will be one time use
      const salt = await bcrypt.genSalt(10);
      const hashedToken = await bcrypt.hash(resetToken, salt);
      await User.updateOne(
        { _id: user._id },
        { $set: { resetPasswordToken: hashedToken } }
      );
      await sendResetPasswordEmail(user.email, resetToken, res);
    } else {
      return res
        .status(400)
        .json({ error: { message: "Email not registered" } });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ error: { message: err.message, stack: err.stack } });
  }
});

module.exports = router;
