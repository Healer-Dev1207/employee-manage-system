const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SalarySchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    employee_name: {
        type: String
    },
    salary: {
        type: Number,
    },
    month: {
        type: Date,
    },
    type: {
        type: String
    }
})

module.exports = mongoose.model("Salary", SalarySchema)