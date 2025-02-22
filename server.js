require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// PostgreSQL Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Required for Railway/Render
});

pool.on("error", (err) => {
  console.error("❌ Database error:", err);
});

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});

// Database Test Route
app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "✅ DB Connected!", time: result.rows[0] });
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    res.status(500).json({ error: "DB Connection Failed" });
  }
});

// Global Error Handling
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
