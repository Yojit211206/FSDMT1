
const express = require("express");

const app = express();

app.use(express.json());

let enrollments = [
    {
        id: 601,
        studentName: "Aarav Gupta",
        courseCode: "CS301",
        courseName: "Data Structures",
        semester: 3,
        attendance: 82
    },
    {
        id: 602,
        studentName: "Meera Joshi",
        courseCode: "CS305",
        courseName: "Database Systems",
        semester: 3,
        attendance: 74
    },
    {
        id: 603,
        studentName: "Kabir Khan",
        courseCode: "CS310",
        courseName: "Computer Networks",
        semester: 3,
        attendance: 91
    }
];

let nextId = 604;

function validateEnrollment(data) {
    return (
        data &&
        typeof data.studentName === "string" &&
        data.studentName.trim() !== "" &&
        typeof data.courseCode === "string" &&
        data.courseCode.trim() !== "" &&
        typeof data.courseName === "string" &&
        data.courseName.trim() !== "" &&
        Number.isInteger(data.semester) &&
        data.semester > 0 &&
        typeof data.attendance === "number" &&
        data.attendance >= 0 &&
        data.attendance <= 100
    );
}

app.get("/api/enrollments", (req, res) => {
    res.status(200).json(enrollments);
});

app.post("/api/enrollments", (req, res) => {
    const data = req.body;

    if (!validateEnrollment(data)) {
        return res.status(400).json({
            message: "Invalid enrollment data"
        });
    }

    const newEnrollment = {
        id: nextId++,
        studentName: data.studentName.trim(),
        courseCode: data.courseCode.trim(),
        courseName: data.courseName.trim(),
        semester: data.semester,
        attendance: data.attendance
    };

    enrollments.push(newEnrollment);

    res.status(201).json(newEnrollment);
});

app.get("/api/enrollments/filter", (req, res) => {
    const semester = Number(req.query.semester);

    if (!req.query.semester || !Number.isInteger(semester) || semester <= 0) {
        return res.status(400).json({
            message: "Please provide a valid semester"
        });
    }

    const result = enrollments.filter(
        e => e.semester === semester
    );

    res.status(200).json(result);
});

app.get("/api/enrollments/low-attendance", (req, res) => {
    const result = enrollments.filter(
        e => e.attendance < 75
    );

    res.status(200).json(result);
});

app.get("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const enrollment = enrollments.find(
        e => e.id === id
    );

    if (!enrollment) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    res.status(200).json(enrollment);
});

app.put("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(
        e => e.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    const data = req.body;

    if (!validateEnrollment(data)) {
        return res.status(400).json({
            message: "Invalid enrollment data"
        });
    }

    enrollments[index] = {
        id: id,
        studentName: data.studentName.trim(),
        courseCode: data.courseCode.trim(),
        courseName: data.courseName.trim(),
        semester: data.semester,
        attendance: data.attendance
    };

    res.status(200).json(enrollments[index]);
});

app.delete("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(
        e => e.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    enrollments.splice(index, 1);

    res.status(200).json({
        message: "Enrollment deleted successfully"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
