import express from 'express';
import User from '../../schema/createuser.js';
import bcrypt from 'bcryptjs';

const Login =()=>{
const app = express()
app.use(express.json());

app.post('/login',async (req,res)=>{
    try{
    const {email , password ,code} = req.body;
    const checkemail = await User.findOne({code});
    const isnamevalid = await email ===checkemail.email;
    
    if(!checkemail || !isnamevalid){
        return res.status(500).json("يرجي التاكد من الحساب واعادة المحاوله")
    }
    const ispasswordValid = await password === checkemail.password;
    // للتحقق من الباسورد
    const hashedPassword = checkemail.password; 
    const hashedPasswordbcrypt =await bcrypt.compare(password, hashedPassword)
    
    if(!ispasswordValid && !hashedPasswordbcrypt){
        return res.status(500).json("يرجي التاكد من الحساب واعادة المحاوله")
    }
    return res.status(200).json({ message: 'Login successful' });
    
    }catch(err){
        return res.status(500).json("خطأ في التسجيل");
    }
    
    })
    return app ; 
    
}

export default Login;