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
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

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
  console.log(`AJ AI Studio Backend running on port ${PORT}`);
});