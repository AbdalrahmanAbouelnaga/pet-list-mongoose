const mongoose = require('mongoose')


const PetSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    birth_date:{
        type:Date,
        required:true,
    },
    breed:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Breed',
        required:true
    },
    images:[{type:String}]
})


module.exports = mongoose.model('Pet',PetSchema)