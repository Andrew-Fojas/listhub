import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./db.js";
import listsRoutes from "./routes/lists.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";

const app = express();
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// routes
app.use("/api/lists", listsRoutes);
app.use("/api/tasks", tasksRoutes);

// health
app.get("/api/health", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5174;

connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
}).catch(err => {
  console.error("DB connection error", err);
  process.exit(1);
});