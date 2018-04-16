const fs = require('fs');
const path = require('path')

const moment = require('moment')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const ejs = require('ejs')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg  = require('imagemin-mozjpeg')

const Employee = require('../models/employee')
const Salary = require('../models/salary')
const Attendance = require('../models/attendance')
const AttendanceDay = require('../models/attendanceDay')
const Work = require('../models/work')
const Category = require('../models/category')

const CustomError = require('../error')

var smtpTransport = nodemailer.createTransport({
	service: 'gmail',
	secure: true,
	auth: {
		user: process.env.GMAIL,
		pass: process.env.GMAIL_APP_PASS,
	},
})


exports.getSalaries = async(req, res, next) => {
    try {
        let salaries = await Salary.find({employee: req.id}).select('-_id date month salary type')
        res.json({
            salaries
        })
    } catch(err) {
        next(err)
    }
}

exports.getSalariesByMonth = async(req, res, next) => {
    try {
        let cy = parseInt(moment().format('YYYY'))
        let lastyearDate = '01/02/' + (cy - 1)
        let nextYearDate = '01/31/' + (cy + 1)
        let salaries = await Salary.aggregate([
            {$match: {employee: req.id, month : { $gte : new Date(lastyearDate), $lte: new Date(nextYearDate)}}},
            { $group : {
                _id : {  type: '$type', month: '$month'},
                amount: { $sum: '$salary' }
                },
                
            },
            { $sort: { '_id.month': 1 }}
        ])
        res.json(salaries)
    } catch(err) {
        next(err)
    }
}

exports.getCardsData = async(req, res, next) => {
    try {
        let currentMonthSalary = 0
        let currentMonthAdvance = 0
        let lastMonthSalary = 0
        let lastMonthAdvance = 0
        let salaryGrowth = 0
        let advanceGrowth = 0

        let currentMonthWork = 0
        let lastMonthWork = 0
        let workGrowth = 0

        let presentDays = 0

        let month = moment().format('M')
        let salaries = await Salary.find({
            $and:[
                { "$expr": { "$eq": [{ "$month": "$month" }, parseInt(month)]}},
                { "$expr": { "$eq": ['$employee', req.id]}}
            ]
        })
        let lastMonthSalaries = await Salary.find({
            $and:[
                { "$expr": { "$eq": [{ "$month": "$month" }, parseInt(month)-1]}},
                { "$expr": { "$eq": ['$employee', req.id]}},
            ]
        })

        for(let salary of salaries){
            if(salary.type.toLowerCase() == 'salary'){
                currentMonthSalary += salary.salary
            } else {
                currentMonthAdvance += salary.salary
            }
        }

        for(let salary of lastMonthSalaries){
            if(salary.type.toLowerCase() == 'salary'){
                lastMonthSalary += salary.salary
            } else {
                lastMonthAdvance += salary.salary
            }
        }

        salaryGrowth = currentMonthSalary - lastMonthSalary
        advanceGrowth = currentMonthAdvance - lastMonthAdvance

        // Work Sort

        let works = await Work.aggregate([
            {$match: {employee: req.id}},
            {$group: {
                _id: { month: {$month: '$date'} },
                total: { $sum : { $multiply: [ '$price', '$quantity' ] } }
            }},
            {$sort: { month: -1}}
        ])
        for(let w of works){
            if(w._id.month == parseInt(month)){
                currentMonthWork = w.total
            } else if(w._id.month == parseInt(month) - 1){
                lastMonthWork = w.total
            }
        }
        workGrowth = currentMonthWork - lastMonthWork

        // Attendance Sort

        let formattedMonth = moment().format('YYYY-MM')
        let attendance = await Attendance.findOne({
            year_month: formattedMonth
        }).populate('days')
        if(attendance){
            for(let d of attendance.days){
                for (let e of d.employees){
                    if(e.empId.toString() === req.id.toString() && e.status.toLowerCase() === 'present'){
                        presentDays += 1
                    }
                }
            }
        }

        res.json({
            currentMonthSalary,
            currentMonthAdvance,
            salaryGrowth,
            advanceGrowth,
            currentMonthWork,
            workGrowth,
            presentDays
        })
    } catch(err) {
        next(err)
    }
}


exports.getWorkChart = async(req, res, next) => {
    try {
        let works = await Work.aggregate([
            {$match: {employee: req.id}},
            { $group : {
                _id : { category: '$category', date: '$date'},
                count: { $sum: '$quantity' },
                },
            },
            { $sort: { _id: 1 }}
        ])
        res.json(
            works
        )
    } catch(err) {
        next(err)
    }
}


exports.getCategories = async(req, res, next) => {
    try {
        let categories = await Category.find()
        res.json(categories)
    } catch(err) {
        next(err)
    }
}

exports.getAttendance = async(req, res, next) => {
    try {
        let attendance = await Attendance.findOne({year_month: req.query.year_month})
        .populate({
            path: 'days', 
            select: { 'employees': {$elemMatch: {empId: req.id}}}
        })
        let flag
        if(attendance){
            for(let a of attendance.days){
                if(a.employees.length < 1){
                    flag = true
                    break
                } 
            }
        }
        if(flag){
            attendance = null
        }
        res.json(
            attendance
        )
    } catch(err) {
        next(err)
    }
}

exports.getWorks = async(req, res, next) => {
    try {
        let works = await Work.find({employee: req.id}).select('-_id category date price quantity').sort('ascending')
        res.json(works)
    } catch(err) {
        next(err)
    }
}

exports.addWork = async(req, res, next) => {
    try {
        await Work.create({
            date: req.body.date,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category,
            employee: req.body.employee
        })
        res.json({
            message: 'Work added!'
        })
    } catch(err) {
        next(err)
    }
}

exports.changeAvatar = async(req, res, next) => {
    try {
        if(req.files.file){
            let allowedFiles = ['.png', '.jpg']
            if(!allowedFiles.includes(path.extname(req.files.file.originalFilename))){
                throw new CustomError('Only .jpg and .png files are allowed!', 406)
            }
            let employee = await Employee.findById(req.id).orFail(
                new CustomError('Employee not found', 404)
            )
            let fileName = new Date().getTime() + '_' + req.files.file.originalFilename
            let file_path ='/public/images/avatars/' + fileName
            if(employee.avatar.url){
                fs.unlinkSync(path.join(__dirname, '..', employee.avatar.url))
            }
            fs.copyFileSync(
                req.files.file.path,
                path.join(__dirname, '..', file_path),
                null,
                (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        fs.unlink(req.files.file.path)
                    }
                }
            )
            await imagemin([`public/images/avatars/${fileName}`], {
                destination: path.join(__dirname, '..', '/public/images/avatars'),
                plugins: [
                    imageminJpegtran({
                        quality: 70
                    }),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            })
            
            employee.avatar.name = req.files.file.originalFilename
            employee.avatar.size = req.files.file.size
            employee.avatar.type = req.files.file.type
            employee.avatar.url = file_path
            await employee.save()
            
            res.json({
                message: 'Avatar Changed Successfully!',
                avatar: file_path
            })
        } else {
            throw new CustomError('Only files allowed', 403)
        }
    } catch(err) {
        next(err)
    }
}

exports.updateProfile = async(req, res, next) => {
    try {
        await Employee.findByIdAndUpdate(req.id, {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        }).orFail(new CustomError('Employee not found', 404))
        res.json({
            message: 'Profile Updated Successfully!'
        })
    } catch(err) {
        next(err)
    }
}

exports.sendResetPasswordEmail = async(req, res, next) => {
    try {
        if(req.body.cooldown){
            throw new CustomError('Wait for the email cooldown!', 403)
        }
        
        let email = req.body.email
        let employee = await Employee.findOne({email: email}).orFail(
            new CustomError('Email ID does not exists!', 404)
        )

        var token = await jwt.sign(
            {
                data: employee._id
            },
            process.env.JWT_SECRET, 
            { expiresIn: '3d' }
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
					name: employee.name,
					link: process.env.CONFIG_DOMAIN + 'reset-password?token=' + token,
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