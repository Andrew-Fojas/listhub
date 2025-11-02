import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    title:  { type: String, required: true, trim: true },
    desc:   { type: String, default: "" },
    done:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);