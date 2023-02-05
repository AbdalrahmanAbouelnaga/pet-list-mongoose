const express = require('express');
const router = express.Router();
const multer = require('multer')
const path  = require('path')
const bcrypt = require('bcrypt')
const saltrounds =  10
const User = require('../models/User')
const Token = require('../models/Token')
const validateToken = require('../middleware/validateToken')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({ storage: storage });




userRouter.post('/signup/',upload.single('image'),async function(req,res,next){
  const data = req.body
  User.findOne({$or: [
    { username: req.body.username },
    { email: req.body.email }
  ]})
      .exec(async (err,user)=>{
        if (err) return res.status(500).json({"error":err})
        if (!user){
        const file = req.file
        data.image = `/${req.file.filename}`
        const salt = await bcrypt.genSalt(saltrounds)
        const hash_password = await bcrypt.hash(data.password,salt)
        data.password = hash_password
        const user = new User(data)
        user.save()
        return res.json({"message":"sign up successful"})

        }else{
          return res.status(400).json({"error":"Username or Email already exists"})
        }
      })
})

userRouter.post('/login/',async function(req,res,next){
  const username = req.body.username
  const password = req.body.password
  console.log(username)
  User.findOne({username:username}).select('+password')
            .exec(async(err,user)=>{
              if (err) return res.json(err)
              if (!user) return res.json({"message":"No user with this username"})
              else{const result = bcrypt.compareSync(password,user.password)
              if (result){
                const token = (await Token.create({"user_id":user.id})).token
                return res.json({"token":token})
              }else{
                return res.json({"error":"Invalid password"})
              }}
            })
})

userRouter.get('/user/',validateToken,function(req,res){
    const user = req.user
    return res.json(user)
})


userRouter.post('/logout/',validateToken,async function(req,res){
    const auth_token = req.headers["authorization"].split(' ')[1]
    const token_instance = await Token.findOne({token:auth_token})
    token_instance.delete()
    return res.sendStatus(200)
})
userRouter.post('/logout/all/',validateToken,async function(req,res){
  const user  = req.user
  const tokens = await Token.find({user_id:user.id})
  tokens.forEach(token=>token.delete())
  return res.sendStatus(200)
})

module.exports = router