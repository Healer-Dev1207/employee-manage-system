const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    desg: {
        type: String
    },
    status:{
        type: String,
        default: 'Active'
    },
    company: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    avatar: {
        name: String,
        size: Number,
        type: {
            type: String
        },
        url: String,
    },
    salaries: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Salary'
        }
    ]
})

module.exports = mongoose.model('Employee', employeeSchema)
