import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt)

    const newuser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath: req.file.originalname,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random()*10000),
        impressions: Math.floor(Math.random()*1000)
    })

    const saveduser = await newuser.save();
    res.status(201).json(saveduser)
  res.json({
    message:"User is register"
  })
  } catch (err) {
    res.status(500).json({error: err.message})
  }
};


/** LOGGING In */

export const login = async(req, res)=>{
  try{
    const {email, password}=req.body;
    const user = await User.findOne({email:email});
    if(!user){
      return res.status(400).json({msg:"User dose not exist"})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg:"Invalid credentials"})

    const token = jwt.sign({id:user._id},process.env.JWT_SERCET);
    delete user.password;
    res.status(200).json({token, user})

  }catch(err){
    res.status(500).json({error: err.message})
  }
}