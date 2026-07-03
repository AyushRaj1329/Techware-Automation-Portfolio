import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import contactRoutes from "./routes/email.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Allow configured client origin + common local Vite ports
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Rate-limit the contact endpoint
const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after a minute.",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (contact form attachments)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/contact", contactLimiter, contactRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", server: "running" });
});

app.listen(PORT, () => {
  console.log(`Contact API running on http://localhost:${PORT}/api/health`);
});

const shutdown = () => process.exit(0);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
