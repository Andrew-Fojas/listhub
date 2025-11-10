import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerEmail: { type: String, index: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("List", ListSchema);