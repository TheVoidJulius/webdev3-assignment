// app.js
// Entry point of the server.

const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(express.json()); // parses JSON request bodies into req.body
app.use(logger); // our custom logger runs on every request

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.status(200).json({ message: "Student Management REST API is running" });
});

// every route inside studentRoutes.js is mounted under /students
// e.g. router.get("/:id") here actually becomes GET /students/:id
app.use("/students", studentRoutes);

// ---------- 404 handler ----------
// Runs only if no route above matched the request.
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- Global error handler ----------
// Express recognizes this as an error handler specifically because
// it takes 4 parameters (err, req, res, next). If any route calls
// next(err), or throws synchronously, it lands here instead of
// crashing the server.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
