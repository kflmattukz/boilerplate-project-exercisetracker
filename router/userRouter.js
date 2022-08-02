const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/users', userController.addUser)
router.get('/users' , userController.getAllUser)

router.post('/users/:id/exercises' , userController.addExercisesToUser)
router.get('/users/:id/exercises' , userController.getAllExerciseByUserId)

router.get('/users/:id/log' , userController.exerciseLogsByUserId)

module.exports = router