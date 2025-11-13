import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "../src/models/Task.js";

// Load environment variables
dotenv.config();

// === CONFIG SECTION ===
// Get connection string from .env
const MONGO_URI = process.env.MONGODB_URI;
// ======================

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB ✅");

  // Backfill tasks with missing emailReminder field
  const emailReminderResult = await Task.updateMany(
    { emailReminder: { $exists: false } },
    { $set: { emailReminder: false } }
  );
  console.log(`Updated ${emailReminderResult.modifiedCount} tasks with emailReminder field`);

  // Backfill tasks with missing emailScheduledId field
  const emailScheduledIdResult = await Task.updateMany(
    { emailScheduledId: { $exists: false } },
    { $set: { emailScheduledId: "" } }
  );
  console.log(`Updated ${emailScheduledIdResult.modifiedCount} tasks with emailScheduledId field`);

  await mongoose.disconnect();
  console.log("✅ Backfill complete. Disconnected from MongoDB.");
}

main().catch(err => {
  console.error("❌ Error during backfill:", err);
  process.exit(1);
});
