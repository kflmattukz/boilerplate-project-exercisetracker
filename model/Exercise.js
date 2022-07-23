const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
  description: String,
  duration: Interger,
  date: date
})

module.exports = mongoose.model('Exercise' , ExerciseSchema)