const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['jobseeker', 'recruiter'],
    required: true
  },
  resume: {
    type: String,
    required: function() {
        return this.role === "jobseeker";
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);