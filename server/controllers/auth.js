const fs = require('fs');
const path = require('path')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const nodemailer = require('nodemailer')

const CustomError = require('../error')

const Admin = require('../models/admin')
const Employee = require('../models/employee')
const Category = require('../models/category')

var smtpTransport = nodemailer.createTransport({
	service: 'gmail',
	secure: true,
	auth: {
		user: process.env.GMAIL,
		pass: process.env.GMAIL_APP_PASS,
	},
})

exports.adminLogin = async(req, res, next) => {
    try{
        let email = req.body.email
        let password = req.body.password
        let user = await Admin.findOne({email: email})
        if(!user){
            throw new CustomError("User not found! Check your credentials", 401)
        }
        let match = await bcrypt.compare(password, user.password)
        let token
        if(match){
            token = jwt.sign({ data: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        } else {
            throw new CustomError("Incorrect Password", 401)
        }
        res.json(
            token
        )
    } catch(err) {
        next(err)
    }
}


exports.adminMe = async(req, res, next) => {
    try{
        let user = await Admin.findById(req.id)
        res.json({user: user})
    } catch(err){
        console.log(err)
    }
}

exports.employeeLogin = async(req, res, next) => {
    try {
        let email = req.body.email
        let password = req.body.password
        let user = await Employee.findOne({email: email}).orFail(
            new CustomError("User not found! Check your credentials", 401)
        )
        if(user.status == 'Disabled'){
            throw new CustomError('Your account has been diabled! Please contact administrator!', 403)
        }
        let match = await bcrypt.compare(password, user.password)
        let token
        if(match){
            token = jwt.sign({ data: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        } else {
            throw new CustomError("Incorrect Password", 401)
        }

        res.json(
            token
        )
    } catch(err) {
        next(err)
    }
}

exports.employeeMe = async(req, res, next) => {
    try {
        let employee = await Employee.findById(req.id).populate('salaries').orFail(
            new CustomError('Employee not found', 404)
        )
        let categories = await Category.find()
        let user = {
            employee: employee,
            categories: categories
        }
        res.json({user: user})
    } catch(err) {
        next(err)
    }
}

exports.changePasswordEmployee = async(req, res, next) => {
    try {
        if(req.body.token){
            let newPass = req.body.password
            let confirmPass = req.body.confPassword
			let id = null
            try {
				let decodedToken = await jwt.verify(
					req.body.token,
					process.env.JWT_SECRET
				)
				id = decodedToken.data
			} catch (err) {
				throw new CustomError('Not Authorized', 403)
			}
            if (newPass != confirmPass) {
				throw new CustomError("Password doesn't match", 400)
			}
            
            let hash = bcrypt.hashSync(req.body.password, 10)
            await Employee.findByIdAndUpdate(id, {
                password: hash
            }).orFail( new CustomError('Employee not found', 404) )
            res.json({
                message: 'Password reset successfully! You will be redirected to homepage soon',
                flag: true
            })
        } else {
			throw new CustomError('Token not found', 403)
		}
    } catch(err) {
        next(err)
    }
}


exports.adminsendResetPasswordEmail = async(req, res, next) => {
    try {
        let admin = await Admin.findOne({email: req.body.email}).orFail(
            new CustomError('Email does not exists!', 404)
        )

        var token = await jwt.sign(
            {
                data: admin._id
            },
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        )
        var mailOptions = {
            from: process.env.GMAIL_FROM,
            to: req.body.email,
            subject: 'Reset Password',
            html: ejs.compile(
                    fs.readFileSync(
                        path.join(__dirname, '..', 'views', 'reset-password.ejs').toString(),
                        'utf-8'
                    )
                )({
					name: admin.name,
					link: process.env.CONFIG_DOMAIN_ADMIN + 'reset-password?token=' + token,
				}),
        }
        await smtpTransport.sendMail(mailOptions)
        res.json({
            message: 'Reset Password email has been sent!'
        })
    } catch(err) {
        next(err)
    }
}

exports.adminChangePassword = async(req, res, next) => {
    try {
        if(req.body.token) {
            let newPass = req.body.password
            let confirmPass = req.body.confPassword
            let id = null
            try {
				let decodedToken = await jwt.verify(
					req.body.token,
					process.env.JWT_SECRET
				)
				id = decodedToken.data
			} catch (err) {
				throw new CustomError('Token Expired or Not Authorized', 403)
			}
            if (newPass != confirmPass) {
				throw new CustomError("Password doesn't match", 400)
			}
            let hash = bcrypt.hashSync(req.body.password, 10)
            await Admin.findByIdAndUpdate(id, {
                password: hash
            }).orFail('Admin not found!', 404)
            res.json({
                message: 'Password reset successfully! You will be redirected to homepage soon',
                flag: true
            })
        } else {
            throw new CustomError('Token not found', 403)
        }
    } catch(err) {
        next(err)
    }
}