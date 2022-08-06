const router = require('express').Router();
const userController = require('../controllers/userController');

//Middleware if params have an id
router.param('id' , userController.isUserExist)

//Router Users
router.route('/users')
  .post(userController.addUser)
  .get(userController.getAllUser)

//Router Exercises
router.route('/users/:id/exercises')
  .post(userController.addExercisesToUser)
  .get(userController.getAllExerciseByUserId)

  //Router Logs
router.get('/users/:id/logs' , userController.exercisesLogsByUserId)


module.exports = router