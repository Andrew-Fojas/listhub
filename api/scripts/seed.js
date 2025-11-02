import "dotenv/config.js";
import mongoose from "mongoose";
import List from "../src/models/List.js";
import Task from "../src/models/Task.js";

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Seeding…");

  await Task.deleteMany({});
  await List.deleteMany({});

  const cooking = await List.create({ name: "Cooking" });
  const school  = await List.create({ name: "School" });
  const home    = await List.create({ name: "Household" });

  await Task.insertMany([
    { listId: cooking._id, title: "Buy groceries for the week", desc: "Veggies, fruits, pasta, chicken", done: true },
    { listId: cooking._id, title: "Try new pasta recipe", desc: "", done: false },
    { listId: cooking._id, title: "Meal prep for Monday", desc: "", done: false },
    { listId: school._id,  title: "Finish math homework", desc: "", done: false },
    { listId: home._id,    title: "Do laundry", desc: "", done: true },
  ]);

  console.log("✅ Seeded");
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });