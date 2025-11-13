import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    title:  { type: String, required: true, trim: true },
    desc:   { type: String, default: "" },
    done:   { type: Boolean, default: false },
    date:   { type: String, default: "" },
    time:   { type: String, default: "" },
    emailReminder: { type: Boolean, default: false },
    emailScheduledId: { type: String, default: "" },
    ownerEmail: { type: String, index: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);