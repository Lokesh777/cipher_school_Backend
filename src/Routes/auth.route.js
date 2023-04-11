const authrouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// register
authrouter.post('/register',async(req,res)=>{

    const {username,email,password,interest}=req.body;
    try{

        const user = await User.findOne({email: email });

        if (user) {
                return res.status(409).json({ message: "User already exists",user });
        }
        else{
                const salt = await bcrypt.genSaltSync(12);
                const hashPass = await bcrypt.hashSync(password, salt);
                const newUser=new User({
                    username:username,
                    email:email,
                    password:hashPass,
                    interest:interest
                })

                const user = await newUser.save();
                res.status(200).json({message: `${username} account with ${email} is created successfully!`,user})

        }


    }catch(err){
        res.status(500).json({
            message:err.message,err
        })
    }

})

//login data
authrouter.post("/login",async (req, res) => {
    const { email, password,username }=req.body;
    try{
  
        const user = await User.findOne({email});
        if (!user) {
            return res.status(209).json({
                message:"this username does not exist!"
            })
        }
  
        bcrypt.compare(password, user.password,(err,result)=>{
               if(err){
                return res.status(401).json({
                    message:"Authentication failed"
                })
               }
               if(result){
                    const token = jwt.sign(
                        {email:user.email, userId:user._id,role:user.role},
                        process.env.secret,
                        {expiresIn:"7 day"}
                    )
                    
                    return res.status(200).json({
                        message:`Login successful for ${user.username}`,
                        token:token,
                        username:user.username,
                        userId:user._id,
                        profile:user.profile,
                        email:user.email,
                    })
               }
  
               return res.status(401).json({
                 message:`wrong password!`
               });
  
        })
  
    }catch(err){
            console.log(err)
          return res.status(500).json({
            err:"Error checking user credentials"
          })
    }
          
  } )

module.exports = authrouter;