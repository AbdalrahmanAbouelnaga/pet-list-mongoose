const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
})


UserSchema.methods.checkPass = function (pass){
    return bcrypt.compareSync(pass,this.password)
}

module.exports = mongoose.model("User",UserSchema)