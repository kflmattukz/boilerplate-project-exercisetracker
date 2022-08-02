const mongoose = require('mongoose')
const User = require('../model/User')
const Exercise = require('../model/Exercise')

exports.getAllUser = function (req,res) {

  User.find()
    .select({
      username: true,
      _id:true
    })
    .exec()
    .then(users => {
      res.status(200).json(users.map(user => {
        return { 
          username: user.username,
          _id: user._id
        }
      }))
    })
    .catch(err => console.log(err))

}

exports.getAllExerciseByUserId = function(req,res) {
  const user_id = req.params.id
  User.find({ _id: user_id })
    .then(user => {
      if (!user) {
        res.status(404).json({ error: true , message: 'User not found' })
      }
      Exercise.find({ user_id: user_id })
        .then(exercises => {
          res.status(200).json({
            username: user[0].username,
            count: exercises.length,
            exercises: exercises.map(ex => {
              return {
                description: ex.description,
                duration: ex.duration,
                date: new Date(ex.date).toDateString()
              }
            })
          })
        })
        .catch(err => console.log(err))

    }).catch(err => console.log(err))
}

exports.addUser = function (req,res) {
  
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

exports.addExercisesToUser = function (req,res) {
  
  const { description , duration , date } = req.body
  const id = req.params.id

  User.findOne({ _id: id })
    .then(user => {
      if (!user) {
        throw new Error('User not fuont')
      }

      Exercise.create({
        user_id: mongoose.Types.ObjectId(user._id),
        description,
        duration,
        date: date || Date.now 
      })
      .then(exercise => {
          let date = new Date(exercise.date)
          date = date.toDateString()
          res.status(201).json({ 
            username: user.username,
            description : exercise.description,
            duration : exercise.duration,
            date: date,
            _id: exercise.user_id
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