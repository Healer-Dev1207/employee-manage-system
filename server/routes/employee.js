const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employee')
const form_data = require('express-form-data')


router.get('/salary', employeeController.getSalaries)

router.get('/salary/monthly', employeeController.getSalariesByMonth)

router.get('/category', employeeController.getCategories)

router.get('/home/cards', employeeController.getCardsData)

router.get('/home/chart', employeeController.getWorkChart)

router.get('/home/attendance', employeeController.getAttendance)

router.get('/works', employeeController.getWorks)

router.post('/works/add', employeeController.addWork)

router.post('/profile/update', employeeController.updateProfile)

router.post('/profile/changeavatar', form_data.parse(), employeeController.changeAvatar)

router.post('/profile/resetpassword', employeeController.sendResetPasswordEmail)

module.exports = router