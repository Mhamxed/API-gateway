// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
    
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Invalid or expired token" })
  }
};

export default authenticateJWT;