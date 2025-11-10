import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./db.js";
import listsRoutes from "./routes/lists.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/lists", listsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/auth", authRoutes); 

// health
app.get("/api/health", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5174;

connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
}).catch(err => {
  console.error("DB connection error", err);
  process.exit(1);
});