const express = require("express");
const router = express.Router();
const Login = require("../models/Login");

// Gets all users login data
router.get("/", async (req, res) => {
  try {
    const logins = await Login.find();
    res.json(logins);
  } catch {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Gets a specific user login data
router.get("/:userId", async (req, res) => {
  try {
    const login = await Login.findById(req.params.userId);
    res.json(login);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Registers a new user
router.post("/", async (req, res) => {
  const login = new Login({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  try {
    const savedUserLogin = await login.save();
    res.json(savedUserLogin);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Deletes a user login
router.delete("/:userId", async (req, res) => {
  try {
    const deletedUserLogin = await Login.remove({ _id: req.params.userId });
    res.json(deletedUserLogin);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Update a specific user
// router.patch("/:userId", async (req, res) => {
//   try {
//     const updatedUserData = await Login.updateOne(
//       { _id: req.params.userId },
//       { $set: { password: req.body.password } }
//     );
//     res.json(updatedUserData);
//   } catch (err) {
//     res.json({ message: err.message, stack: err.stack });
//   }
// });

module.exports = router;
