// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Student Records API is running" });
});

// Init DB table and start server
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INTEGER,
        course VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("Database table ready");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("DB init error:", err.message);
    process.exit(1);
  }
};

initDB();