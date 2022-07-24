const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
  
  user_id: {  type: mongoose.ObjectId , required: true},
  username: { type: String , required: true },
  description: { type: String , required: true },
  duration: { type: Number, required: true },
  date: { type: Date , required:true }

})

const Exercise = mongoose.model("Exercise", ExerciseSchema)

module.exports = Exercise