import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./prismaClient.js";
import authRouter from "./routes/auth.js";
import employeesRouter from "./routes/employees.js";
import onboardingRouter from "./routes/onboarding.js";
import requestsRouter from "./routes/requests.js";
import leaveTypesRouter from "./routes/leaveTypes.js";
import holidaysRouter from "./routes/holidays.js";
import attendanceRouter from "./routes/attendance.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Allow the configured client origin plus common local Vite ports.
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no origin) and any allowed localhost port.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/leave-types", leaveTypesRouter);
app.use("/api/holidays", holidaysRouter);
app.use("/api/attendance", attendanceRouter);

// Health check - also verifies the database connection.
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

// Graceful shutdown.
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
