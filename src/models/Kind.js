const mongoose = require('mongoose')

const KindSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    breeds:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Breed' }]
})


module.exports = mongoose.model('Kind',KindSchema)