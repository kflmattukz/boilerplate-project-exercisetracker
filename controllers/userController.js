const mongoose = require('mongoose')
const moment = require('moment')
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
  User.findById(user_id)
    .then(user => {
      
      if (!user) return res.status(404).json({ error: true , message: 'User not found' })

      Exercise.find({ user_id: user_id })
        .then(exercises => {
          res.status(200).json({
            username: user.username,
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

  User.findById(id)
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
          res.status(201).json({ 
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: new Date(exercise.date).toDateString(),
            _id: exercise.user_id
          })
        })
        .catch(err => console.log(err))
    })
 
}

exports.exercisesLogsByUserId = async (req,res) => {
  
  let { from,to,limit } = req.query
  const id = req.params.id
  
  from = moment(from, 'yyyy-mm-dd').isValid() ? moment(from , 'yyyy-mm-dd') : 0
  to = moment(to, 'yyyy-mm-dd').isValid() ? moment(to , 'yyyy-mm-dd') : moment().add(1000000000000)

  const user = await User.findById(id)
  // console.log(user)
  if (!user) throw new Error('User not Found')

  const exercises = await Exercise.find({ user_id: id }).where('date').gte(from).lte(to).limit(+limit).exec()
  // console.log(exercises)
  const logs = {
    _id: user._id,
    username: user.username,
    count: exercises.length,
    log: exercises.map(exercise => {
      let {description, duration, date} = exercise
      date = new Date(date).toDateString()
      return {
        description,
        duration,
        date
      }
    })
  }
  res.status(200).json(logs)
}