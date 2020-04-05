const express = require("express");
const router = express.Router();
const Login = require("../models/Login");
const Register = require("../models/Register");
const { registerValidation, loginValidation } = require("../validation");

// Gets all users login data (for debug purposes)
router.get("/", async (req, res) => {
  try {
    const logins = await Login.find();
    res.json(logins);
  } catch {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Gets a specific user
router.get("/login/:username", async (req, res) => {
  // Validating before login
  const { error } = loginValidation(req.body);
  if (error) {
    const errMessage = error.details[0].message;
    return res.status(400).send(errMessage);
  }

  try {
    const login = await Login.findOne({ username: req.params.username });
    res.json(login);
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
    return res.status(400).send(errMessage);
  }

  const register = new Register({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  try {
    const savedUser = await register.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Deletes a user
router.delete("/:userId", async (req, res) => {
  try {
    const deletedUser = await Login.remove({ _id: req.params.userId });
    res.json(deletedUser);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

module.exports = router;
