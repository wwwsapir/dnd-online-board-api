const mongoose = require("mongoose");

const LoginSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Login", LoginSchema);
