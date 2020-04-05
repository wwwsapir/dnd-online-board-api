const mongoose = require("mongoose");

const RegisterSchema = mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Register", RegisterSchema);
