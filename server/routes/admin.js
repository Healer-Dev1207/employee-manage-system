const express = require('express')
const router = express.Router()

const form_data = require('express-form-data')

const adminController = require('../controllers/admin')
const auth = require('../middlewares/admin')
const admin = require('../models/admin')

router.get('/employees', adminController.getEmployees)

router.get('/employees/:id', adminController.getEmployee)

router.post('/employees/add', adminController.addEmployee)

router.post('/employees/edit', adminController.editEmployee)

router.post('/employees/changepassword', adminController.changePassword)

router.post('/employees/delete', adminController.delEmployee)

// Salary Routes

router.get('/salary', adminController.getSalaries)

router.post('/salary/add', adminController.addSalary)

router.post('/salary/delete', adminController.delSalary)


// Attendance Routes

router.post('/attendance/update', adminController.updateAttendance)

router.get('/attendance/:id', adminController.getAttendances)

// Work Routes
router.get('/work', adminController.getAllWorks)

router.get('/work/day', adminController.getWorkByDay)

router.post('/work/add', adminController.addWork)

router.post('/work/delete', adminController.delWork)

router.get('/work/:id', adminController.getWorksById)

// Category Routes

router.post('/category/add', adminController.addCategory)

router.post('/category/delete', adminController.delCategory)

// Profile Routes

router.post('/profile/update', adminController.updateProfile)

router.post('/profile/changelogo', form_data.parse(), adminController.changeCompanyLogo)


module.exports = router
