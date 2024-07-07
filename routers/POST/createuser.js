import express from 'express';
import User from '../../schema/createuser.js';
import bcrypt from 'bcryptjs';

const createUser = ()=>{
    const app = express()
    app.use(express.json());

      app.post('/user',async (req,res)=>{
        try{
            const {email, password , code} = req.body;
        
            if (!email || !password || !code) {
                return res.status(400).json({ message: "All fields are required." });
            }
            const checkemail =await User.findOne({email})
            const checkecode =await User.findOne({code})
            if(checkemail || checkecode){
                return res.status(300).json("جرب حساب اخر ")
            }
        // لتشفير الباسورد
        const saltRounds = 10;
        
        const hashedpassword =await bcrypt.hash(password, saltRounds)
        
            await User.create({email, password : hashedpassword , code})
            return res.status(200).json("تم انشاء الحساب");
        
        }catch(err){
           return res.status(500).json({message : err.message})
        }
        })

return app;

}

export default createUser;