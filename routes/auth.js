const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Gets all users data (for debug purposes)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Verify user exists (forgot password?)
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("Should send an email with the password");
    }
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Login
router.post("/login", async (req, res) => {
  // Validating before login
  const { error } = loginValidation(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.status(400).json(errMessage);
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("Email or password are invalid");

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(passwordValid);
    if (!passwordValid)
      return res.status(400).json("Email or password are invalid");

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_ADDITION);
    res
      .header("auth-token", token)
      .json({ userId: savedUser._id, userName: savedUser.username });
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Registers a new user
router.post("/register", async (req, res) => {
  // Validating before register
  const { error } = registerValidation(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.status(400).json(errMessage);
  }

  // Checking if the user already exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).json("Email already registered");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
  });

  try {
    const savedUser = await newUser.save();
    res.json({ userId: savedUser._id, userName: savedUser.username });
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Deletes a user
router.delete("/:userId", async (req, res) => {
  try {
    const deletedUser = await User.remove({ _id: req.params.userId });
    res.json(deletedUser);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

module.exports = router;
