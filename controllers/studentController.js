// controllers/studentController.js
const pool = require("../db");

// GET all students
const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single student
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create student
const createStudent = async (req, res) => {
  try {
    const { name, email, age, course } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const result = await pool.query(
      "INSERT INTO students (name, email, age, course) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, age, course]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "Email already exists" });
    res.status(500).json({ error: err.message });
  }
};

// PUT update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, course } = req.body;
    const result = await pool.query(
      "UPDATE students SET name=$1, email=$2, age=$3, course=$4 WHERE id=$5 RETURNING *",
      [name, email, age, course, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM students WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};