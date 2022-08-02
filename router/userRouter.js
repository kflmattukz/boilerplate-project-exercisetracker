const router = require('express').Router();
const userController = require('../controllers/userController');
//Router Users
router.post('/users', userController.addUser)
router.get('/users' , userController.getAllUser)
//Router Exercises
router.post('/users/:id/exercises' , userController.addExercisesToUser)
router.get('/users/:id/exercises' , userController.getAllExerciseByUserId)
//Router Logs
router.get('/users/:id/logs' , userController.exercisesLogsByUserId)

module.exports = router