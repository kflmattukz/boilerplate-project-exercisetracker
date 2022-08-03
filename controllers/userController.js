const mongoose = require('mongoose')
const moment = require('moment')
const User = require('../model/User')
const Exercise = require('../model/Exercise')

exports.getAllUser = async (req,res) => {
  try {
    let users = await User.find().select({ username: true, _id:true}).exec()
  
    users = users.map(user => {
      const {username,_id} = user
      return {
        username,
        _id
      }
    })

    res.status(200).json(users)
  } catch(e) {
    console.log(e.message)
    return res.status(500).json({ message: 'something went wrong'})
  }
}

exports.getAllExerciseByUserId = async (req,res) => {
  const user_id = req.params.id

  try{
    const user = await User.findById(user_id)
    if (!user) throw new Error('User not found')

    const exercises = await Exercise.find({ user_id })

    const userExercises = {
      username: user.username,
      count: exercises.length,
      exercises: exercises.map(ex => {
        let {description, duration, date} = ex
        date = new Date(date).toDateString()
        return {
          description,
          duration,
          date
        }
      })
    }

    res.status(200).json(userExercises)
  } catch (e) {
    console.log(e.message)
    res.status(500).json({message: 'something went wrong'})
  }
}

exports.addUser = async (req,res) => {
  const { username } = req.body
  try{
    const newUser = await User.create({ username })
    if (!newUser) throw new Error('add user Failed, try again later')
    res.status(201).json({
      username: newUser.username,
      _id: newUser._id
    })
  } catch (e) {
    console.log(e.message)
    res.status(200).json({ message: 'add user failed, something went wrong, please try again later'})
  }
}

exports.addExercisesToUser = async (req,res) => {
  
  const { description , duration , date } = req.body
  const id = req.params.id

  try {
    const user = await User.findById(id)
    if (!user) throw new Error('User not found')
    const newExercise = await Exercise.create({
      user_id: mongoose.Types.ObjectId(user._id),
      description,
      duration,
      date: date || Date.now()
    })

    const { username , _id} = user
    
    res.status(201).json({ 
      username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: new Date(newExercise.date).toDateString(),
      _id
    })
  } catch(e) {
    console.log(e.message)
    res.status(500).json({ message: 'add exercise failed, please try again later' })
  }
}

exports.exercisesLogsByUserId = async (req,res) => {
  
  const id = req.params.id
  // const from = moment(req.query.from, 'YYYY-MM-DD').isValid() ? moment(req.query.from , 'YYYY-MM-DD') : 0
  // const to = moment(req.query.to, 'YYYY-MM-DD').isValid() ? moment(req.query.to , 'YYYY-MM-DD') : moment().add(1000000000000)
  const from = new Date(req.query.from) || 0
  const to = new Date(req.query.to) || new Date(Date.now())
  const limit = Number(req.query.limit) || 0
  console.log({from, to ,limit})
  const user = await User.findById(id)
  
  if (!user) throw new Error('User not Found')

  const exercises = await Exercise.find({ user_id: id }).where('date').gte(from).lte(to).limit(+limit).exec()
  
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