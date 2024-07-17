import express from 'express';
import Images from '../../schema/imagesSlider.js';

const PostImage = ()=>{
const app = express();
app.use(express.json());

app.post('/image', async (req ,res) => {
    try{
 const {image , label ,caption } = req.body;

 if(!image){
  return res.status(400).json({message : "هناك مشكله في ارسال الصوره اللي السيرفر"});
 }

await Images.create({image , label ,caption })
 res.status(201).json({message : "تم تحميل الصوره بنجاح" , image})
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

return app;
} 
export default PostImage ;
