import { Router } from "express";
import passport from "../auth/google.js";
import { signUserToken, requireAuth } from "../lib/auth.js";

const { CLIENT_URL } = process.env;
const r = Router();

// Start Google login
r.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback from Google
r.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${CLIENT_URL}/login?error=google` }),
  async (req, res) => {
    // req.user was set in the strategy
    const token = signUserToken(req.user);
    // set httpOnly cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect(`${CLIENT_URL}/`);
  }
);

// Who am i?
r.get("/me", requireAuth, (req, res) => {
  const { _id, email, name, avatar } = req.user;
  res.json({ id: _id.toString(), email, name, avatar });
});

// Log out
r.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default r;