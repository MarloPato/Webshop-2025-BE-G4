import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export default router;
