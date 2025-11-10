import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true, unique: true },
  email:    { type: String, index: true },
  name:     String,
  avatar:   String,
  createdAt:{ type: Date, default: Date.now },
  lastLogin:{ type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);