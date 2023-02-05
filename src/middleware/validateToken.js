const JWT = require('jsonwebtoken')

const Token = require('../models/Token')

const User = require('../models/User')


const validateToken= async (req,res,next)=>{
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)
    JWT.verify(token,process.env.TOKEN_SECRET,async (err,decoded)=>{
        if (err) return res.sendStatus(401)
        const exists = await Token.exists({token:token})
        if (!exists) return res.sendStatus(401)
        req.user= await User.findOne({id:decoded.user_id})
        return next()
    })
}

module.exports = validateToken