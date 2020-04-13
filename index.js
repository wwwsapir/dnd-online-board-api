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
      console.log("port:", process.env.PORT);
    }
  }
);

// Start to listen
app.listen(process.env.PORT);

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res
      .status(400)
      .json({ error: { message: err.message, stack: err.stack } });
  }
});
