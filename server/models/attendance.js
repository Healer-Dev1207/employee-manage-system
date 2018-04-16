const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    year_month:{
        type: Date
    },
    days: [{
        type: Schema.Types.ObjectId,
        ref: 'AttendanceDay'
    }]
})

module.exports = mongoose.model('Attendance', AttendanceSchema)