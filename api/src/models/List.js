import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("List", ListSchema);