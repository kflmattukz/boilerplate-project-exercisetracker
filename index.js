const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
// const userRouter = require('./router/userRouter')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use('/api' , userRouter)
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const UserSchema = new mongoose.Schema({
  username: { type:String, required: true }
})

const User = mongoose.model('User' , UserSchema)

const ExerciseSchema = new mongoose.Schema({
  
  user_id: {  type: mongoose.ObjectId , required: true},
  username: { type: String , required: true },
  description: { type: String , required: true },
  duration: { type: Number, required: true },
  date: { type: Date , required:true }

})

const Exercise = mongoose.model("Exercise", ExerciseSchema)

app.post('/api/users' , function (req,res) {
  
  const { username } = req.body
  
  User.create({ username })
    .then(({_id , username}) => { 
      res.status(201).json({ 
        username, 
        _id 
      }) 
    })
    .catch(err => console.log(err))

})


app.post('/api/users/:id/exercises' , function (req,res) {
  
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
 
})

app.get('/api/users/:id/logs' , function (req,res) {
  
  const id = req.params.id
  
  Exercise.find({ user_id: id})
    .sort({date: 1})
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
        logs: []  
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
})

mongoose.connect(process.env.MONGODB_URI)
  .then(client => {
    module.exports = client
    console.log('Connect Success!')
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log('Your app is listening on port ' + listener.address().port)
    })
  })
  .catch(err => console.log(err)) 


