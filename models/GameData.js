const mongoose = require("mongoose");

const GameDataSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
  gameState: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("GameData", GameDataSchema);
