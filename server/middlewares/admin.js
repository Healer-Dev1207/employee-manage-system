const jwt = require("jsonwebtoken")

const Admin = require('../models/admin')
const CustomError = require('../error')

module.exports = async (req, res, next) => {
    try{
        let token = req.headers.authorization.split(' ')[1]
        let decodedtoken = await jwt.verify(token, process.env.JWT_SECRET)
        let user = await Admin.findById(decodedtoken.data)
        if(user){
            req.id = user._id
            next()
        } else {
            throw new CustomError("Not Authorized", 403)
        }
        
    } catch(err) {
        console.log(err)
        error = new CustomError("Authorization Token expired", 401)
        next(error)
    }
    
}