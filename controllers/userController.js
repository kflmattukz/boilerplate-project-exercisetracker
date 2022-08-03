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
  
  // User.findById(user_id)
  //   .then(user => {
      
  //     if (!user) return res.status(404).json({ error: true , message: 'User not found' })

  //     Exercise.find({ user_id: user_id })
  //       .then(exercises => {
  //         res.status(200).json({
  //           username: user.username,
  //           count: exercises.length,
  //           exercises: exercises.map(ex => {
  //             return {
  //               description: ex.description,
  //               duration: ex.duration,
  //               date: new Date(ex.date).toDateString()
  //             }
  //           })
  //         })
  //       })
  //       .catch(err => console.log(err))

  //   }).catch(err => console.log(err))
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
    const { description, duration, date } = newExercise

    res.status(201).json({ 
      username,
      description,
      duration,
      date: new Date(date).toDateString(),
      _id
    })
  } catch(e) {
    console.log(e.message)
    res.status(500).json({ message: 'add exercise failed, please try again later' })
  }
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