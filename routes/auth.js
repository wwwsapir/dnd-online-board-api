const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
  resetPasswordValidation,
} = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetPasswordEmail } = require("../utils/sendEmail");

// Check if authToken matches the passwordResetToken saved in user
router.get("/user/:authToken", async (req, res) => {
  const genericError = {
    error: { message: "Token is Invalid. Cannot reset password." },
  };

  try {
    const userId = jwt.verify(req.params.authToken, process.env.TOKEN_ADDITION)
      ._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json(genericError);

    const tokenMatchesUser = await bcrypt.compare(
      req.params.authToken,
      user.resetPasswordToken
    );
    if (!tokenMatchesUser) return res.status(400).json(genericError);

    return res.status(200).json("Token matches!");
  } catch (err) {
    return res
      .status(400)
      .json({ error: { message: err.message, stack: err.stack } });
  }
});

// Login
router.post("/login", async (req, res) => {
  // Validating before login
  const { error } = loginValidation(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.status(400).json({ error: { message: errMessage } });
  }

  const genericError = { error: { message: "Email or password are invalid" } };

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json(genericError);

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordValid) return res.status(400).json(genericError);

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

// Verify user exists (forgot password?) and send reset password email
router.post("/reset_password/send", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const resetToken = jwt.sign(
        { extra: user.password, _id: user._id },
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

// Reset user's password
router.post("/reset_password/reset", async (req, res) => {
  try {
    const { error } = resetPasswordValidation(req.body);
    if (error) {
      const errMessage = error.details[0].message;
      console.log("Joi message:", errMessage);
      return res.status(400).json({ error: { message: errMessage } });
    }

    const userId = jwt.verify(req.body.authToken, process.env.TOKEN_ADDITION)
      ._id;

    const genericError = { error: { message: "Sorry, someting went wrong." } };

    const user = await User.findById(userId);
    if (!user) return res.status(400).json(genericError);

    const tokenMatchesUser = await bcrypt.compare(
      req.body.authToken,
      user.resetPasswordToken
    );
    if (!tokenMatchesUser) return res.status(400).json(genericError);

    const passwordIdenticalToPrevious = await bcrypt.compare(
      req.body.newPassword,
      user.password
    );
    if (passwordIdenticalToPrevious)
      return res.status(400).json({
        error: {
          message: "New password must be different from the current one.",
        },
      });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

    await User.updateOne(
      { _id: userId },
      { $set: { password: hashedNewPassword, resetPasswordToken: undefined } }
    );
    return res.status(200).json("Password changed!");
  } catch (err) {
    return res
      .status(400)
      .json({ error: { message: err.message, stack: err.stack } });
  }
});

module.exports = router;
