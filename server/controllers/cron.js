const moment = require('moment')

const Attendance = require('../models/attendance')
const AttendanceDay = require('../models/attendanceDay')
const Employee = require('../models/employee')


exports.updateDailyAtt = async(req, res, next) => {
    try {
        let cm = moment().format('YYYY-MM')
        let day = moment().format('D')
        let attendance = await Attendance.findOne({year_month: cm}).populate('days')
        if(attendance.days.length >= 1){
            let tempId = attendance.days.find(d => d.day == day)._id
            // await AttendanceDay.findByIdAndUpdate(tempId, {
            //     $set: { 'employees.$[empId].status' : 'present' },
            //     arrayFilters: [{ 'empId.status' : 'holiday' }],
            //     multi: true
            // })
            let aDay = await AttendanceDay.findById(tempId)
            if(aDay.employees.length >= 1){
                for(let e of aDay.employees){
                    if(e.status === 'holiday'){
                        e.status = 'present'
                    }
                }
            }
            await aDay.save()
        }
        console.log("Marked present for everyone")
    } catch(err) {
        console.log(err)
    }
}

exports.createMonthlyAttChart = async(req, res, next) => {
    try{
        let month = moment().format('YYYY-MM')
        let days = moment(month).daysInMonth()
        let attendance = await Attendance.create({
            year_month: month
        })
        let employees = await Employee.aggregate([
            {$project: { _id: 0 , empId: "$_id" }}
        ])
        if(employees.length > 0){
            for(let i=1; i<=days; i++){
                let attendancedays = await AttendanceDay.create({
                    day: i,
                    employees: employees
                })
                attendance.days.push(attendancedays)
            }
            await attendance.save()
        }
        res.json({
            message: "Attendance has been created"
        })
        
    } catch(err) {
        console.log(err)
    }
}