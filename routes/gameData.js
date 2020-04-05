const express = require("express");
const router = express.Router();
const GameData = require("../models/GameData");

// Gets all users saved game data
router.get("/", async (req, res) => {
  try {
    const gamesData = await GameData.find();
    res.json(gamesData);
  } catch {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Gets a specific user login data by the user id
router.get("/:userId", async (req, res) => {
  try {
    const gameData = await Login.findOne({ userId: req.params.userId });
    res.json(gameData);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Records a saved game data
router.post("/", async (req, res) => {
  const gameData = new Login({
    userId: req.body.userId,
    gameState: req.body.gameState,
  });

  try {
    const savedUserLogin = await gameData.save();
    res.json(savedUserLogin);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Deletes an existing game data
router.delete("/:userId", async (req, res) => {
  try {
    const deletedGameData = await Login.remove({ userId: req.params.userId });
    res.json(deletedGameData);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

// Update a specific game data
router.patch("/:userId", async (req, res) => {
  try {
    const updatedGameData = await Login.updateOne(
      { userId: req.params.userId },
      { $set: { gameState: req.body.gameState } }
    );
    res.json(updatedGameData);
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
});

module.exports = router;
