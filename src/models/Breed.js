const mongoose = require('mongoose')

const BreedSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    kind:{type: mongoose.Schema.Types.ObjectId,ref:'Kind'}
})

module.exports = mongoose.model('Breed',BreedSchema)