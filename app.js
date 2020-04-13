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

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("Connection errors:", err);
    } else {
      console.log("Connected to DB!");
      console.log("port:", process.env.PORT);
    }
  }
);

// Start to listen
app.listen(process.env.PORT);
