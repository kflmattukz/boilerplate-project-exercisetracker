const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const userRouter = require('./router/userRouter')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api' , userRouter)
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

mongoose.connect(process.env.MONGODB_URI)
  .then(client => {
    module.exports = client
    // console.log('Connect Success!')
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log('Your app is listening on port ' + listener.address().port)
    })
  })
  .catch(err => console.log(err)) 


