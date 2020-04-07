const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  userName: {
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
  resetPasswordToken: { type: String, required: false },
});

module.exports = mongoose.model("User", UserSchema);
