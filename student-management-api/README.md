# Student Management REST API

Web Dev III — Unit 2 Lab Assignment 2. Express.js CRUD API for student records,
in-memory array only (no database, no Mongoose).

## Project Structure

```
student-management-api/
├── app.js                  # server entry point
├── routes/
│   └── studentRoutes.js    # all /students endpoints
├── middleware/
│   └── logger.js           # custom request logger
├── data/
│   └── students.js         # in-memory array (acts as the "database")
└── package.json
```

## Setup

```bash
npm install
npm start          # or: npm run dev  (nodemon, auto-restarts on save)
```

Server runs at `http://localhost:3000`.

## Endpoints

| Method | Route            | Body                          | Success | Errors        |
|--------|------------------|--------------------------------|---------|---------------|
| GET    | /students        | —                               | 200     | —             |
| GET    | /students/:id    | —                               | 200     | 404           |
| POST   | /students        | `{ name, age, course }`         | 201     | 400           |
| PUT    | /students/:id    | any of `{ name, age, course }`  | 200     | 400, 404      |
| DELETE | /students/:id    | —                               | 200     | 404           |

## Testing in Postman

1. Create a new collection "Student Management API".
2. **GET all** — `GET http://localhost:3000/students`
3. **GET one** — `GET http://localhost:3000/students/1`
4. **POST** — `POST http://localhost:3000/students`, Body → raw → JSON:
   ```json
   { "name": "Neha Gupta", "age": 20, "course": "BCA" }
   ```
5. **PUT** — `PUT http://localhost:3000/students/2`, Body → raw → JSON:
   ```json
   { "age": 23 }
   ```
6. **DELETE** — `DELETE http://localhost:3000/students/3`
7. To see 400/404 in action: POST with a missing field, or GET/DELETE an id
   that doesn't exist (e.g. `/students/999`).
8. Watch the terminal running `npm start` — the logger prints every request
   as `[timestamp] METHOD /url`.

---

## Viva prep — likely questions and how to answer

**Q: What is middleware in Express, and how does yours work?**
Middleware is just a function `(req, res, next)` that sits between the
incoming request and the final route handler. `app.use(logger)` registers it
so it runs on *every* request before Express looks at the routes. It logs
the timestamp, method and URL, then calls `next()` to hand control forward.
If you forget `next()`, the request just hangs — nothing else ever runs.

**Q: What's "modular routing" here, and why bother?**
`studentRoutes.js` creates its own `express.Router()` — basically a
mini sub-app that only knows about paths like `/` and `/:id`. `app.js`
decides where that router actually lives by writing
`app.use("/students", studentRoutes)`. So `router.get("/:id")` really
answers `GET /students/:id`. This keeps `app.js` short and lets you drop in
more resources later (e.g. `teacherRoutes.js`) without touching student code.

**Q: How do you generate a new id in POST, and why not just use `students.length + 1`?**
`students.length` breaks after a delete — if you have 3 students and delete
one, length is 2, so the next POST would reuse an id that might still be
in use. Instead I take the id of the *last* item in the array and add 1,
so ids keep increasing and stay unique.

**Q: Why does PUT let you send only some fields instead of the whole object?**
It's a partial update — `if (name) student.name = name;` only overwrites a
field if it was actually sent in the body. That way `PUT /students/2` with
just `{ "age": 23 }` updates age and leaves name/course untouched, which is
closer to how PATCH-style updates behave in real APIs.

**Q: Where does your 404 come from vs your 400?**
400 (Bad Request) fires when the *client's input is invalid* — e.g. POST
without a name/age/course. 404 (Not Found) fires when the input is
well-formed but the resource doesn't exist — e.g. `GET /students/999`.
There's also a catch-all `app.use((req,res)=>...)` after all routes for
completely unknown URLs like `/foo`.

**Q: What's the point of the error-handling middleware at the bottom of app.js?**
Express treats any middleware with **4 parameters** — `(err, req, res, next)`
— as a special error handler, and skips straight to it if something calls
`next(err)` or throws. It's a safety net: instead of the server crashing or
leaking a stack trace to the client, it logs the error server-side and
responds with a clean `500 Internal Server Error`.

**Q: Why is the data in a separate file (`data/students.js`) instead of
inside app.js or the routes file?**
Separation of concerns — routes handle HTTP logic, the data file holds
state. Because `module.exports = students` exports the *array reference*
itself (not a copy), every file that does `require("../data/students")`
shares the same array in memory, so a POST in one request is visible to a
GET in the next.

**Q: Where would this break, and how would you fix it for production?**
The array lives in RAM, so restarting the server wipes all data — that's
why the assignment restricts it to array/JSON only. A real version would
swap `data/students.js` for a database layer (Mongo/Postgres) behind the
same function calls, without changing the routes at all.
