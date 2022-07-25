const mongoose = require('mongoose')
const User = require('../model/User')
const Exercise = require('../model/Exercise')

exports.getAllUser = function (req,res) {

  User.find()
    .select({
      username: true,
      _id:true
    })
    .then(doc => {
      res.status(200).json(doc)
    })
    .catch(err => console.log(err))

}

exports.getAllExerciseByUserId = function(req,res) {
  const id = req.params.id

  Exercise.find({ user_id: id})
    .select({
      username:true,
      user_id:true,
      description: true,
      duration: true,
      date:true
    })
    .then(doc => {
      let exercises = {
        username: doc[0].username,
        _id: doc[0].user_id,
        exercises: []
      }

      doc.map(exercise => {
        exercises.exercises.push({
          description: exercise.description,
          duraion: exercise.duration,
          date: new Date(exercise.date).toDateString()
        })
      })
      res.status(200).json(exercises)
    })
}

exports.createUser = function (req,res) {
  
  const { username } = req.body
  
  User.create({ username })
    .then(({_id , username}) => { 
      res.status(201).json({ 
        username, 
        _id 
      }) 
    })
    .catch(err => console.log(err))

}

exports.createExercises = function (req,res) {
  
  const { description , duration , date } = req.body
  const id = req.params.id

  User.findOne({ _id: id })
    .then(doc => {
      Exercise.create({ user_id: mongoose.Types.ObjectId(doc._id),username: doc.username , description : description , duration : duration, date: date })
        .then(doc => {
          let date = new Date(doc.date)
          date = date.toDateString()
          res.status(201).json({ 
            username: doc.username,
            description : doc.description,
            duration : doc.duration,
            date: date,
            _id: doc.user_id
          })
        })
        .catch(err => console.log(err))

    })
 
}

exports.exerciseLogs = function (req,res) {
  
  const id = req.params.id
  
  Exercise.find({ user_id: id})
    .select({
      username: true,
      user_id: true,
      description: true,
      duration: true,
      date:true
    })
    .exec()
    .then(doc => {
      let jsonData = {
        username: doc[0].username,
        count: doc.length,
        _id: doc[0].user_id,
        log: []  
      }
      for (let i = 0 ; i < doc.length ; i++) {
        let date = new Date(doc[i].date).toDateString()
        jsonData.logs.push({
          description: doc[i].description,
          duration: doc[i].duration,
          date: date
        })
      }

      res.json(jsonData)
    })
    .catch(err => console.log(err))
}