import React, { useState, useEffect } from "react";

/* ---------------- LOCAL STORAGE KEYS ---------------- */
const STUDENTS_KEY = "students";
const SESSION_KEY = "student_session";

/* ---------------- LOCAL STORAGE FUNCTIONS ---------------- */
function getStudents() {
  return JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [];
}

function saveStudents(students) {
  localStorage.setItem(
    STUDENTS_KEY,
    JSON.stringify(students)
  );
}

function saveSession(student) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(student)
  );
}

function getSession() {
  return JSON.parse(
    localStorage.getItem(SESSION_KEY)
  );
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ================= SIGNUP PAGE ================= */
function Signup({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    course: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const students = getStudents();

    const studentExists = students.find(
      (student) =>
        student.email === form.email
    );

    if (studentExists) {
      alert("Student already registered");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: form.name,
      roll: form.roll,
      course: form.course,
      email: form.email,
      password: form.password,
    };

    saveStudents([
      ...students,
      newStudent,
    ]);

    alert("Signup Successful");

    setForm({
      name: "",
      roll: "",
      course: "",
      email: "",
      password: "",
    });

    setPage("login");
  }

  return (
    <div className="container">
      <div className="box">
        <h1>Student Signup</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="roll"
            placeholder="Enter Roll Number"
            value={form.roll}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course"
            placeholder="Enter Course"
            value={form.course}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Signup
          </button>
        </form>

        <p>
          Already have account?{" "}
          <span
            onClick={() =>
              setPage("login")
            }
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= LOGIN PAGE ================= */
function Login({
  setPage,
  setStudent,
}) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const students =
      getStudents();

    const foundStudent =
      students.find(
        (student) =>
          student.email ===
            form.email &&
          student.password ===
            form.password
      );

    if (!foundStudent) {
      alert(
        "Invalid Email or Password"
      );
      return;
    }

    saveSession(foundStudent);
    setStudent(foundStudent);

    alert("Login Successful");

    setForm({
      email: "",
      password: "",
    });

    setPage("dashboard");
  }

  return (
    <div className="container">
      <div className="box">
        <h1>Student Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have account?{" "}
          <span
            onClick={() =>
              setPage("signup")
            }
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard({
  student,
  logout,
}) {
  return (
    <div className="container">
      <div className="box">
        <h1>Student Dashboard</h1>

        <h2>
          Welcome {student?.name}
        </h2>

        <p>
          <strong>Roll No:</strong>{" "}
          {student?.roll}
        </p>

        <p>
          <strong>Course:</strong>{" "}
          {student?.course}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {student?.email}
        </p>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  const [page, setPage] =
    useState("signup");

  const [student, setStudent] =
    useState(null);

  /* AUTO LOGIN */
  useEffect(() => {
    const session =
      getSession();

    if (session) {
      setStudent(session);
      setPage("dashboard");
    }
  }, []);

  /* LOGOUT */
  function logout() {
    clearSession();
    setStudent(null);
    setPage("login");
  }

  /* CSS */
  useEffect(() => {
    const style =
      document.createElement(
        "style"
      );

    style.innerHTML = `
      body {
        margin: 0;
        font-family: Arial;
        background: #f2f2f2;
      }

      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }

      .box {
        width: 350px;
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        text-align: center;
      }

      h1 {
        margin-bottom: 20px;
      }

      input {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
      }

      button {
        width: 100%;
        padding: 10px;
        margin-top: 15px;
        border: none;
        background: blue;
        color: white;
        border-radius: 5px;
        cursor: pointer;
      }

      span {
        color: blue;
        cursor: pointer;
        font-weight: bold;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(
        style
      );
    };
  }, []);

  /* PAGE ROUTING */
  if (page === "signup") {
    return (
      <Signup setPage={setPage} />
    );
  }

  if (page === "login") {
    return (
      <Login
        setPage={setPage}
        setStudent={setStudent}
      />
    );
  }

  return (
    <Dashboard
      student={student}
      logout={logout}
    />
  );
}