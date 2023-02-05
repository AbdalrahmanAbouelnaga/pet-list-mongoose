const JWT = require('jsonwebtoken')

async function SignToken(id){
    return JWT.sign(id,process.env.TOKEN_SECRET)
}
module.exports = SignToken