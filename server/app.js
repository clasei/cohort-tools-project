const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// [ REMOVED ]

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

//MONGOOSE
//mongodb://127.0.0.1 esto es la ip por defecto
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// model-schemas
const Student = require("./models/student.model");
const Cohort = require("./models/cohort.model");

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// --------------- ROUTES
// --------------- STUDENT

// POST aka create new student
app.post("/api/students", async (req, res) => {
  try {
    const response = await Student.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      linkedinUrl: req.body.linkedinUrl,
      languages: req.body.languages,
      program: req.body.program,
      background: req.body.background,
      image: req.body.image,
      projects: req.body.projects,
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "error creating new student" });
  }
});

// GET all students
app.get("/api/students", async (req, res) => {
  try {
    // const response = await Student.find();
    const response = await Student.find().populate("cohort"); // .populate will replace ObjectId with the cohort info
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "error fetching students" });
  }
});

// GET students from a specific cohort (by cohortId)
app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const response = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort"); // .populate
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "error fetching students by cohort" });
  }
});

// GET a specific student by id
app.get("/api/students/:studentId", async (req, res) => {
  try {
    const response = await Student.findById(req.params.studentId).populate(
      "cohort"
    ); // .populate

    // // possible 404
    // if (!response) {
    //   return res.status(404).json({ message: "student not found" });
    // }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "error fetching student by id" });
  }
});

// UPDATE a specific student by id
app.put("/api/students/:studentId", async (req, res) => {
  try {
    const response = await Student.findByIdAndUpdate(
      req.params.studentId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        linkedinUrl: req.body.linkedinUrl,
        languages: req.body.languages,
        program: req.body.program,
        background: req.body.background,
        image: req.body.image,
        projects: req.body.projects,
      },
      { new: true }
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "error updating student by id" });
  }
});

// DELETE a specific student by id
app.delete("/api/students/:studentId", async (req, res) => {
  try {
    const response = await Student.findByIdAndDelete(req.params.studentId);
    res.status(204).json({ message: "Deleted student" });
  } catch (error) {
    res.status(500).json({ message: "error deleting student by id" });
  }
});

// --------------- ROUTES
// --------------- COHORT

// POST aka create a new cohort
app.post("/api/cohorts", async (req, res) => {
  try {
    const response = await Cohort.create({
      cohortSlug: req.body.cohortSlug,
      cohortName: req.body.cohortName,
      program: req.body.program,
      format: req.body.format,
      campus: req.body.campus,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      inProgress: req.body.inProgress,
      programManager: req.body.programManager,
      leadTeacher: req.body.leadTeacher,
      totalHours: req.body.totalHours,
    });

    res.status(201).json(response);
    console.log(response);
  } catch (error) {
    res.status(500).json({ message: "error creating cohort" });
  }
});

// GET all cohorts
app.get("/api/cohorts", async (req, res) => {
  try {
    const response = await Cohort.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "error fetching cohorts" });
  }
});

// GET cohort by id
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const response = await Cohort.findById(req.params.cohortId);

    // // possible 404 added
    // if (!response) {
    //   return res.status(404).json({ message: "cohort not found" });
    // }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "error finding ID cohorts" });
  }
});

// PUT aka updates a specific cohort
app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const response = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      {
        cohortSlug: req.body.cohortSlug,
        cohortName: req.body.cohortName,
        program: req.body.program,
        format: req.body.format,
        campus: req.body.campus,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        inProgress: req.body.inProgress,
        programManager: req.body.programManager,
        leadTeacher: req.body.leadTeacher,
        totalHours: req.body.totalHours,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "error updating ID cohorts" });
  }
});

// DELETE cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const response = await Cohort.findByIdAndDelete(req.params.cohortId);
    res.status(204).json({ message: "Deleted cohort" });
  } catch (error) {
    res.status(500).json({ message: "error deleting cohort by id" });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
