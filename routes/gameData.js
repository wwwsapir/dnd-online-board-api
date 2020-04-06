const express = require("express");
const router = express.Router();
const GameData = require("../models/GameData");
const verify = require("./verifyToken");

// Gets all users saved game data
// router.get("/", verify, async (req, res) => {
//   try {
//     const gamesData = await GameData.find();
//     res.json(gamesData);
//   } catch {
//     res.json({ error: { message: err.message, stack: err.stack } });
//   }
// });

// Gets a specific user Game data by the user id
router.get("/:userId", verify, async (req, res) => {
  try {
    const gameData = await GameData.findOne({ userId: req.params.userId });
    res.status(200).json(gameData);
  } catch (err) {
    res.status(400).json({ error: { message: err.message, stack: err.stack } });
  }
});

// Records a saved game data
router.post("/", verify, async (req, res) => {
  const gameData = new Login({
    userId: req.body.userId,
    gameState: req.body.gameState,
  });

  try {
    const savedUserLogin = await gameData.save();
    res.status(200).json(savedUserLogin);
  } catch (err) {
    res.status(400).json({ error: { message: err.message, stack: err.stack } });
  }
});

// Deletes an existing game data
router.delete("/delete/", verify, async (req, res) => {
  try {
    const deletedGameData = await GameData.remove({ userId: req.body.userId });
    if (deletedGameData.deletedCount === 1) {
      res.status(200).json("Deleted Successfully");
    } else {
      res.status(400).json("Couldn't find game data to delete");
    }
  } catch (err) {
    res.json({ error: { message: err.message, stack: err.stack } });
  }
});

// Update a specific game data
router.patch("/:userId", verify, async (req, res) => {
  try {
    const updatedGameData = await GameData.updateOne(
      { userId: req.params.userId },
      { $set: { gameState: req.body.gameState } }
    );
    res.status(200).json(updatedGameData);
  } catch (err) {
    res.status(400).json({ error: { message: err.message, stack: err.stack } });
  }
});

module.exports = router;
