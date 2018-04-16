const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
    company: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    company_logo: {
        name: String,
        size: Number,
        type: {
            type: String
        },
        url: String,
    },
    categories: [String]
})

module.exports = mongoose.model('Admin', AdminSchema)