const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const userRoutes = require("./routes/userRoutes");
const toolRoutes = require("./routes/toolRoutes");
const toolHistoryRoutes = require("./routes/toolHistoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://aj-ai-studio.vercel.app",
  "https://aj-ai-studio-j9b5d6vnk-arjeets-projects.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // such as Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// JSON body parser
app.use(express.json());

// MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/tool-history", toolHistoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AJ AI Studio Backend is running 🚀",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `AJ AI Studio Backend running on port ${PORT}`
  );
});