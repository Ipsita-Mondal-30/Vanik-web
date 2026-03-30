import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
