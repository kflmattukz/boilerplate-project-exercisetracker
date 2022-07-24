const mongoose = require('mongoose')
const User = require('../model/User')
const Exercise = require('../model/Exercise')

exports.createUser = function (req,res) {
  
  User.create({ username: req.body.username })
    .then(doc => { res.status(201).json({ _id: doc._id , username: doc.username }) })
    .catch(err => console.log(err))

}

exports.createExercises = function (req,res) {
  
  const { description , duration , date } = req.body
  const id = req.params.id

  User.findOne({ _id: id })
    .then(doc => {
      
      Exercise.create({ user_id: mongoose.Types.ObjectId(doc._id),username: doc.username , description : description , duration : duration, date: date })
        .then(doc => {
          res.status(201).json({ _id: doc.user_id , username: doc.username , description : doc.description , duration : doc.duration, date: doc.date })
        })
        .catch(err => console.log(err))

    })

  //res.json({ "_id": id,"date": date,"duration": parseInt(duration),"description": description })
  //complete json response
  // res.json({ "_id": id,"username": username ,"date": date,"duration": parseInt(duration),"description": description })
  
}