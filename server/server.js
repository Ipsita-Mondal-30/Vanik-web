import http from "http";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED:", err);
});
import postRoutes from "./routes/postRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import { setupChatSocket } from "./socket/chatSocket.js";

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
app.use("/api/assistant", assistantRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/assistant", assistantRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

setupChatSocket(io);

async function start() {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Socket.io ready (CORS: ${corsOrigin})`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
