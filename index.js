const express = require("express");
const mongoose = require("mongoose");
const { connection } = require("./controllers/connection");
const { route } = require("./routes/user.route");
const { notes } = require("./routes/notes.router");
const { auth } = require("./Middleware/auth.middleware");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// Apply middleware for user route
app.use("/", route);

// Apply auth middleware for all routes below this line
app.use(auth);

// Apply middleware for notes route
app.use("/", notes);

const PORT = process.env.port || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await connection;
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
});
