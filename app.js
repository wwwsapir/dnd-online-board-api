const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const gameDataRoute = require("./routes/gameData");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/gameData", gameDataRoute);

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("Connection errors:", err);
    } else {
      console.log("Connected to DB!");
    }
  }
);

// Start to listen
app.listen(9000);
