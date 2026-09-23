// data/students.js
// In-memory "database" — just a JS array, as required (no MongoDB/Mongoose allowed).
// Every route file that needs student data imports this same array,
// so all changes (POST/PUT/DELETE) are shared across requests
// as long as the server keeps running.

let students = [
  { id: 1, name: "Rahul Sharma", age: 20, course: "BCA" },
  { id: 2, name: "Priya Verma", age: 21, course: "BTech" },
  { id: 3, name: "Amit Singh", age: 22, course: "BCA" },
];

module.exports = students;
