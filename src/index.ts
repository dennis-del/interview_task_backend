// src/index.ts
import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import router from "./routes/authRouter"; 
import { connectDB } from "./config/connection";
import { requestLogger, errorHandler } from "./middleware/appMiddleware"; 
import authRouter from "./routes/authRouter";
import eventRouter from "./routes/eventRouter";
import participantRouter from "./routes/participantRouter";
import eventParticipantRouter from "./routes/eventParticipantRouter";


dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(requestLogger);

// Static folder (for file uploads if you add it later)
app.use("/uploads", express.static("./uploads"));

// Routes
app.use(router);

app.use("/auth",authRouter)

app.use("/events", eventRouter);

app.use("/participants", participantRouter);

app.use("/event-participant", eventParticipantRouter);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 9001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
