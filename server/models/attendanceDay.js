const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AttendanceDaySchema = new Schema({
    day: Number,
    employees: [{
        empId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee'
        },
        status: {
            type: String,
            default: 'holiday'
        }
    }],
})

module.exports = mongoose.model('AttendanceDay', AttendanceDaySchema)