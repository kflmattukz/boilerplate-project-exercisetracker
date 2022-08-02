const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
  
  user_id: {  
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    maxlength: [25, 'Description too long, not greater than 25'],
    required: true
  },
  duration: {
    type: Number,
    min: [1, 'Duration too short, at least 1 minute'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required:true
  }

})

const Exercise = mongoose.model("Exercise", ExerciseSchema)

module.exports = Exercise