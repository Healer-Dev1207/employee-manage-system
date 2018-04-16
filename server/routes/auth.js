const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')

const isAdmin = require('../middlewares/admin')
const isEmployee = require('../middlewares/employee')

router.post('/admin', authController.adminLogin)

router.get('/admin/me', isAdmin, authController.adminMe)

router.post('/admin/change-password', authController.adminChangePassword)

router.post('/admin/sendresetemail', authController.adminsendResetPasswordEmail)

router.post('/employee', authController.employeeLogin)

router.get('/employee/me', isEmployee, authController.employeeMe)

router.post('/employee/change-password', authController.changePasswordEmployee)




module.exports = router