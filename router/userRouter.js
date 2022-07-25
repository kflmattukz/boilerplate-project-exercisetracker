const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/users' , userController.getAllUser)
router.post('/users', userController.createUser)
router.post('/users/:id/exercises' , userController.createExercises)
router.get('/users/:id/exercises' , userController.getAllExerciseByUserId)
router.get('/users/:id/logs' , userController.exerciseLogs)

module.exports = router