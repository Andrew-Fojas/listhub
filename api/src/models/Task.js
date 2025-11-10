import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    title:  { type: String, required: true, trim: true },
    desc:   { type: String, default: "" },
    done:   { type: Boolean, default: false },
    ownerEmail: { type: String, index: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);