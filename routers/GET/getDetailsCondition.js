import express from 'express';
import Conditions from '../../schema/condition.js';


const DetailsCondition = ()=>{
const app = express();
app.use(express.json());

app.get("/condition/:id" , async(req,res)=>{
   
    try{
     const { id }= req.params ; 
 
     const finddetails = await Conditions.find({code: id});
 
   if(!finddetails){
     return  res.status(500).json("حدث خطا");
   }
 
   return res.status(200).json(finddetails);
 
 
    }catch(error){
     res.status(500).json({ error: error.message });
    }
 })
return app;

}
export default DetailsCondition;