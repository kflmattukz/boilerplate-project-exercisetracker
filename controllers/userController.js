exports.createUser = function (req,res) {

  res.json({ "username": req.body.username })

}

exports.createExercises = function (req,res) {
  
  const id = req.params.id

  const { _id , username , date , duration ,description } = req.body

  
  res.json({ "_id": id,"date": date,"duration": parseInt(duration),"description": description })
  //complete json response
  // res.json({ "_id": id,"username": username ,"date": date,"duration": parseInt(duration),"description": description })
  
}