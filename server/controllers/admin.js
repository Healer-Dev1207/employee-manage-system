const fs = require('fs');
const path = require('path')

const moment = require('moment')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const Employee = require('../models/employee')
const Salary = require('../models/salary')
const Attendance = require('../models/attendance')
const AttendanceDay = require('../models/attendanceDay')
const Work = require('../models/work')
const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const CustomError = require('../error');
const admin = require('../models/admin');



exports.getEmployees = async(req, res, next) => {
    try{
        const employees = await Employee.find()
        res.json({
            employees
        })
    } catch(err) {
        next(err)
    }
}

exports.addEmployee = async(req, res, next) => {
    try {
        let admin = await Admin.findById(req.id)
        let hash = bcrypt.hashSync(req.body.password, 10)
        let existingEmail = await Employee.findOne({email: req.body.email})
        if(existingEmail){
            throw new CustomError('Email already exists!', 406)
        }
        const employee = await Employee.create({
            date: req.body.date,
            name: req.body.name,
            desg: req.body.desg,
            email: req.body.email,
            password: hash,
            company: admin.company
        })

        let cm = moment().format('YYYY-MM')
        let attendance = await Attendance.findOne({year_month: cm})
    
        for(let d of attendance.days){
            await AttendanceDay.findByIdAndUpdate(d, {
                $push: {employees: {empId: employee}}
            })
        }
        res.json({
            message: 'New Employee Created!'
        })
    } catch(err) {
        next(err)
    }
}

exports.editEmployee = async(req, res, next) => {
    try {
        await Employee.findByIdAndUpdate(req.body.id, {
            date: req.body.date,
            name: req.body.name,
            desg: req.body.desg,
            email: req.body.email,
            status: req.body.status
        }).orFail(
            new CustomError('Employee not found!', 404)
        )
        res.json({
            message: 'Employee edited successfully!'
        })
    } catch(err) {
        next(err)
    }
}

exports.changePassword = async(req, res, next) => {
    try {
        let password = req.body.password
        let confPassword = req.body.password
        if(password != confPassword){
            throw new CustomError('Passwords do no match', 401)
        }
        let hash = bcrypt.hashSync(password, 10) 
        await Employee.findByIdAndUpdate(req.body.id, {
            password: hash
        }).orFail(
            new CustomError('Employee not found!', 404)
        )
        res.json({
            message: 'Password Changed Successfully!'
        })
    } catch(err) {
        next(err)
    }
}

exports.delEmployee = async(req, res, next) => {
    try {
        await Employee.findByIdAndDelete(req.body.id).orFail(
            new CustomError('Employee not found!', 404)
        )
        let attendances =  await Attendance.find()
        
        for(let a of attendances){
            for(let d of a.days) {
                await AttendanceDay.findByIdAndUpdate(d, {
                    $pull: { employees:  {empId: employee} }
                })
            }
        }

        for(let s of employee.salaries){
            await Salary.findByIdAndDelete(s).orFail(
                new CustomError('Employee deleted but its salaries could not be deleted', 500)
            )
        }
        
        res.json({
            message: 'Employee deleted'
        })
    } catch(err) {
        next(err)
    }
}

exports.getEmployee = async(req, res, next) => {
    try {
        employee = await Employee.findById(req.params.id).populate('salaries')
        res.json({
            employee
        })
    } catch(err){
        next(err)
    }
}


exports.getSalaries = async(req, res, next) => {
    try {
        let salaries = await Salary.find()
        res.json({
            salaries
        })
    } catch(err) {
        next(err)
    }
}

exports.addSalary = async(req, res, next) => {
    try {
        const employee = await Employee.findById(req.body.employee).orFail(
            new CustomError('Employee not found!', 404)
        )
        const salary = await Salary.create({
            date: req.body.date,
            salary: req.body.salary,
            month: req.body.month,
            type: req.body.type,
            employee: employee,
            employee_name: employee.name
        })
        employee.salaries.push(salary)
        await employee.save()

        res.json({
            message: 'New Salary Added!'
        })
    } catch(err) {
        next(err)
    }
}

exports.delSalary = async(req, res, next) => {
    try {
        await Salary.findByIdAndDelete(req.body.id).orFail(
            new CustomError('Salary could not be deleted', 500)
        )
        await Employee.findOneAndUpdate({salaries: {$in: [req.body.id]}}, {$pull: { salaries :{ $in : req.body.id}}})
        .orFail(
            new CustomError('Employee not found!', 404)
        )
        res.json({
            message: 'Salary deleted successfully!'
        })
    } catch(err) {
        next(err)
    }
}


exports.getAttendances = async(req, res, next) => {
    try {
        let attendance = await Attendance.findOne({year_month: req.query.year_month})
        .populate({
            path: 'days', 
            select: { 'employees': {$elemMatch: {empId: req.params.id}}}
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
        res.json(attendance)
    } catch(err) {
        next(err)
    }
}

exports.updateAttendance = async(req, res, next) => {
    try {
        let attendancedays = await AttendanceDay.findOne({'employees._id':req.body.id})
            .select({ 'employees': {$elemMatch: {_id: req.body.id}}})
        
        attendancedays.employees.forEach((emp) => {
            emp.status = req.body.status
        })
        await attendancedays.save()
        res.json({
            message: 'Attendance Status Updated'
        })
    } catch(err) {
        next(err)
    }
}

exports.getWorkByDay = async(req, res, next) => {
    try{
        let works = await Work.aggregate([
            { $group : {
                _id : { category: '$category', date: '$date'},
                count: { $sum: '$quantity' },
                },
            },
            { $sort: { _id: 1 }}
        ])
        res.json(works)
    } catch(err) {
        next(err)
    }
}

exports.getAllWorks = async(req, res, next) => {
    try {
        let works = await Work.find()
        res.json({
            works
        })
    } catch(err) {
        next(err)
    }
}

exports.getWorksById = async(req, res, next) => {
    try {
        let works = await Work.find({employee: req.params.id})
        res.json({
            works
        })
    } catch(err) {
        next(err)
    }
}

exports.addWork = async(req, res, next) => {
    try {
        let work = await Work.create({
            date: req.body.date,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category,
            employee: req.body.employee,
        })
        res.json({
            message: 'Work Added Successfully!'
        })
    } catch(err) {
        next(err)
    }
}


exports.delWork = async(req, res, next) => {
    try {

        await Work.findByIdAndDelete(req.body.id).orFail(
            new CustomError('Work could not be deleted', 500)
        )
        
        res.json({
            message: 'Work deleted'
        })
    } catch(err) {
        next(err)
    }
}

exports.addCategory = async(req, res, next) => {
    try {
        await Admin.findByIdAndUpdate(req.id, {
            $push: {categories: req.body.category}
        }).orFail(
            new CustomError('Admin not found', 404)
        )
        res.json({
            message: "Category Added"
        })
    } catch(err) {
        next(err)
    }
}

exports.delCategory = async (req, res, next) => {
    try {
        await Admin.findByIdAndUpdate(req.id, {
            $pull: {categories: req.body.category}
        }).orFail(
            new CustomError('Admin not found', 404)
        )
        res.json({
            message: "Category Deleted"
        })
    } catch(err) {
        next(err)
    }
}

exports.updateProfile = async(req, res, next) => {
    try {
        await Admin.findByIdAndUpdate(req.id, {
            name: req.body.name,
            email: req.body.email,
            company: req.body.company
        }).orFail(
            new CustomError('Admin not found!', 404)
        )
        await Employee.updateMany({}, {
            $set: { 'company': req.body.company }
        })
        res.json({
            message: "Profile Updated!"
        })
    } catch(err) {
        next(err)
    }
}


exports.changeCompanyLogo = async(req, res, next) => {
    try {
        if(req.files.file){
            let allowedFiles = ['.png', '.jpg']
            if(!allowedFiles.includes(path.extname(req.files.file.originalFilename))){
                throw new CustomError('Only .jpg and .png files are allowed!', 406)
            }
            let admin = await Admin.findById(req.id).orFail(
                new CustomError('User not Found!', 404)
            )
            let fileName = new Date().getTime() + '_' + req.files.file.originalFilename
            let file_path ='/public/images/company_logos/' + fileName
            if(admin.company_logo.url){
                fs.unlinkSync(path.join(__dirname, '..', admin.company_logo.url))
            }
            fs.copyFileSync(
                req.files.file.path,
                path.join(__dirname, '..', file_path),
                null,
                (err) => {
                    if (err) {
                        throw new CustomError('Something went wrong!', 500)
                    } else {
                        fs.unlink(req.files.file.path)
                    }
                }
            )
            await imagemin([`public/images/company_logos/${fileName}`], {
                destination: path.join(__dirname, '..', '/public/images/company_logos'),
                plugins: [
                    imageminJpegtran({
                        quality: 70
                    }),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            })
            admin.company_logo.name = req.files.file.originalFilename
            admin.company_logo.size = req.files.file.size
            admin.company_logo.type = req.files.file.type
            admin.company_logo.url = file_path
            await admin.save()
            res.json({
                message: 'Logo Changed Successfully!',
                company_logo: file_path
            })
        } else {
            throw new CustomError('Only files allowed', 403)
        }
    } catch(err) {
        next(err)
    }
}





///////////////////////////////////////////////////