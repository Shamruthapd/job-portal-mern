const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: { type: [String], default: [] },
  jobType: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  lastDate: { type: Date, required: true },
  }, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);