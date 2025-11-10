import mongoose from "mongoose";
import dotenv from "dotenv";
import List from "../src/models/List.js";
import Task from "../src/models/Task.js";

// Load environment variables
dotenv.config();

// === CONFIG SECTION ===
// Get connection string from .env
const MONGO_URI = process.env.MONGODB_URI;
// add email
const TARGET_EMAIL = "redacted@domain.com";
// ======================

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB ✅");

  // Backfill lists
  const listsResult = await List.updateMany(
    { ownerEmail: { $exists: false } },
    { $set: { ownerEmail: TARGET_EMAIL } }
  );
  console.log(`Updated ${listsResult.modifiedCount} lists`);

  // Backfill tasks
  const tasksResult = await Task.updateMany(
    { ownerEmail: { $exists: false } },
    { $set: { ownerEmail: TARGET_EMAIL } }
  );
  console.log(`Updated ${tasksResult.modifiedCount} tasks`);

  await mongoose.disconnect();
  console.log("✅ Backfill complete. Disconnected from MongoDB.");
}

main().catch(err => {
  console.error("❌ Error during backfill:", err);
  process.exit(1);
});
