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

  // Backfill tasks with missing date field
  const dateResult = await Task.updateMany(
    { date: { $exists: false } },
    { $set: { date: "" } }
  );
  console.log(`Updated ${dateResult.modifiedCount} tasks with date field`);

  // Backfill tasks with missing time field
  const timeResult = await Task.updateMany(
    { time: { $exists: false } },
    { $set: { time: "" } }
  );
  console.log(`Updated ${timeResult.modifiedCount} tasks with time field`);

  await mongoose.disconnect();
  console.log("✅ Backfill complete. Disconnected from MongoDB.");
}

main().catch(err => {
  console.error("❌ Error during backfill:", err);
  process.exit(1);
});
