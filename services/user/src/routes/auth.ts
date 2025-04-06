import * as express from 'express'
import type { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User } from "../models/User";

const auth = express.Router();

auth.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, isAdmin } = req.body;
    const existing = await User.findOne({ username });

    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, isAdmin });

    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});


auth.post("/login", async (req: Request, res: Response): Promise<any> => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  
      res.status(200).json({ token });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  

export default auth;