import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

passport.use(new GoogleStrategy(
  {
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL:  GOOGLE_CALLBACK_URL
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const { id: googleId } = profile;
      const email  = profile.emails?.[0]?.value ?? "";
      const name   = profile.displayName ?? "";
      const avatar = profile.photos?.[0]?.value ?? "";

      let user = await User.findOne({ googleId });
      if (!user) {
        user = await User.create({ googleId, email, name, avatar });
      } else {
        user.email = email || user.email;
        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.lastLogin = new Date();
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;