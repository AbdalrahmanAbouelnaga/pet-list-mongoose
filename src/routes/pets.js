const router = require('express').Router()
const Kind = require('../models/Kind')
const Breed = require('../models/Breed')
const Pet = require('../models/Pet')
const validateToken = require('../middleware/validateToken')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
const upload = multer({ storage: storage });
  


router.get('/pets/',validateToken,async function(req,res){
    const pets = await Pet.find({owner:req.user.id})
    if (!pets.length) return res.json({"message":"you do not have any pets yet."})
    return res.json(pets)
})

router.post('/pets/add/',validateToken,upload.array('images'),async function(req,res){
    console.log(req.body)
    const owner = req.user.id
    const breed_name = req.body.breed
    const kind_name = req.body.kind
    const data = {
        name:req.body.name,
        owner:owner,
        birth_date:req.body.birth_date,
        images: !req.files?req.file.filename:req.files.map(file=>file.filename)
    }
    Breed.findOne({name:breed_name}).exec((err,breed)=>{
        if (err) return res.json(err)
        if (breed === null){
            Kind.findOne({name:kind_name}).exec((err,kind)=>{
                if (err) return res.json(err)
                if (!kind){
                    Kind.create({name:kind_name})
                        .then((kind)=>{
                            Breed.create({name:breed_name,kind:kind.id})
                                 .then(breed=>{
                                    data.breed = breed.id
                                    Pet.create(data)
                                        .then(pet=>{
                                            return res.json({'message':"pet created successfully."})
                                        }).catch(error=>{
                                            console.log(error)
                                            return res.json({"error":error})
                                        })
                                 }).catch(error=>{
                                    console.log(error)
                                    return res.json({"error":error})
                                })
                        }).catch(error=>{
                            console.log(error)
                            return res.json({"error":error})
                        })
                }else{
                Breed.create({name:breed_name,kind:kind.id})
                    .then(breed=>{
                        data.breed = breed.id
                        Pet.create(data)
                            .then(pet=>{
                        return res.json({'message':"pet created successfully."})
                        }).catch(error=>{
                        console.log(error)
                        return res.json({"error":error})
                        })
                    })}
            })
        }else{
        console.log(breed)
        data.breed = breed.id
                        Pet.create(data)
                            .then(pet=>{
                        return res.json({'message':"pet created successfully."})
                        }).catch(error=>{
                        console.log(error)
                        return res.json({"error":error})
                        })}

    })

    
})



module.exports = router