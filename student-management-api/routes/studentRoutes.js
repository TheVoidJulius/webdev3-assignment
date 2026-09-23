// routes/studentRoutes.js
// All /students endpoints live here (modular routing).
// This file only knows about "/", "/:id" etc. — app.js decides
// that these routes actually live under the "/students" prefix.

const express = require("express");
const router = express.Router();
const students = require("../data/students");

// GET /students -> get all students
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// GET /students/:id -> get one student by id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${id} not found`,
    });
  }

  res.status(200).json({ success: true, data: student });
});

// POST /students -> create a new student
router.post("/", (req, res) => {
  const { name, age, course } = req.body;

  // basic validation -> 400 Bad Request if fields are missing
  if (!name || !age || !course) {
    return res.status(400).json({
      success: false,
      message: "name, age and course are all required",
    });
  }

  const newStudent = {
    // generate the next id from the last student, not from students.length,
    // so ids stay unique even after a delete (length would repeat an id)
    id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
    name,
    age,
    course,
  };

  students.push(newStudent);
  res.status(201).json({ success: true, data: newStudent });
});

// PUT /students/:id -> update an existing student
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${id} not found`,
    });
  }

  const { name, age, course } = req.body;

  if (!name && !age && !course) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field (name, age, course) to update",
    });
  }

  // only overwrite fields that were actually sent (partial update)
  if (name) student.name = name;
  if (age) student.age = age;
  if (course) student.course = course;

  res.status(200).json({ success: true, data: student });
});

// DELETE /students/:id -> remove a student
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${id} not found`,
    });
  }

  const [deletedStudent] = students.splice(index, 1);
  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: deletedStudent,
  });
});

module.exports = router;
