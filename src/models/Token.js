const mongoose = require('mongoose')
const SignToken = require('../middleware/auth')

const TokenSchema = new mongoose.Schema({
    token:{
        type:String,
        unique:true,
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        required:true,
    }
})
TokenSchema.pre('save',async function(next){
    const model = this 
    let user_id = model.user_id
    console.log(model)
    console.log(`inside token schema: ${model.user_id}`)
    model.token = await SignToken({"user_id":user_id})
    return next()
})

module.exports = mongoose.model('Token',TokenSchema)