const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose")

const Cohort = require('./models/cohort')
const Student = require('./models/student')

const PORT = 5005;

mongoose.connect('mongodb://127.0.0.1:27017/cohort-tools-api')
  .then(() => console.log('connected to MongoDB db: test-cohort-tools-api'))
  .catch((err) => console.error('error connecting to MongoDB', err))

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// const cohorts = require('./cohorts.json') // using now MongoDB db
// const students = require('./students.json') // using now MongoDB db


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express

const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(cors({
  origin: 'http://localhost:5173' // add [ ] if it's an array 
}))

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get('/api/cohorts/', (req, res) => {
//   res.json(cohorts)
// })

// app.get('/api/students', (req, res) => {
//   res.json(students)
// })


// START SERVER

app.get('/api/cohorts', async (req, res) => {
  try {
    const cohorts = await Cohort.find()
    // console.log('cohorts db fetched')
    res.json(cohorts)
  } catch (error) {
    res.status(500).json({ message: 'error fetching cohorts' })
  }
})

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find()
    // .populate would add to the fetched data the cohort info -- referenced via ObjectID
    // const students = await Student.find().populate('cohort'); 
    // console.log('students db fetched')
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: 'error fetching students' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});