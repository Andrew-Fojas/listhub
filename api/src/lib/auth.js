import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

export function signUserToken(user) {
  return jwt.sign({ uid: user._id }, JWT_SECRET, { expiresIn: "7d" });
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.uid);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}