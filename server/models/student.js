const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  linkedinUrl: { type: String, default: "" },
  languages: { 
    type: [String], 
    enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"] 
  },
  program: { 
    type: String, 
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"], 
    required: true 
  },
  background: { type: String, default: "" },
  image: { type: String, default: "https://i.imgur.com/r8bo8u7.png" },
  cohort: { 
    // we could go for...
    // cohort: new mongoose.Types.ObjectId()
    // BUT this would generate a new ObjectId instead of using the existing aka reference FAILED
    type: mongoose.Schema.Types.ObjectId, // defines the cohort field as an ObjectId = MongoDB type for document references
    ref: "Cohort",  // reference to cohort, it will creates a reference to the Cohort model aka the ObjectId of a cohort document
    required: true 
  },
  projects: { type: [String] } // array of strings
});

// const Student = mongoose.model("Student", studentSchema);
// module.exports = Student;

module.exports = mongoose.model('Students', studentSchema)
