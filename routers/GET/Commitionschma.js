import express from 'express';
import Commitionschma from '../../schema/commitionadmin.js';


const Commitionschmas = ()=>{
const app = express();
app.use(express.json());

app.get("/Commitionschma" , async(req,res)=>{
   
    try{
        const getCommitionschma = await Commitionschma.find()
        res.status(200).json(getCommitionschma);
        
 
    }catch(error){
     res.status(500).json({ error: error.message });
    }
 });

return app;
}
export default Commitionschmas;