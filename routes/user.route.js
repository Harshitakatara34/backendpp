const express = require("express");
const { UserModel } = require("../Model/user.model");
const route = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


route.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // User with the same email already exists
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password and create a new user
    bcrypt.hash(password, 4, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const user = new UserModel({ email, password: hash });
      await user.save();
      res.send("User registered");
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, "harshi", {
      expiresIn: "1h", // Token expiration time
    });
console.log(token)
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


  
module.exports = {
  route,
};
