import express from 'express';
import Images from '../../schema/imagesSlider.js';
import multer from 'multer';
import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;


const PostImage = ()=>{
const app = express();
app.use(express.json());

const storage = multer.memoryStorage();// تخزين الصورة في الذاكرة مؤقتًا
// Multer setup for handling file uploads
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // حجم الصورة محدود بـ 5MB
  fileFilter: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    if (ext === 'jpeg' || ext === 'png' || ext === 'jpg') {
      cb(null, true);
    } else {
      cb(new Error('Only jpg, jpeg, and png are allowed'), false);
    }
  },
});

app.post('/image',upload.array('images', 5), async (req ,res) => {
    try{
        let imageUrls = [];

      // إذا تم رفع صور جديدة
        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            const imageBase64 = file.buffer.toString('base64');
            try {
              const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}&expiration=0`,
                qs.stringify({ image: imageBase64 }),
                {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                }
              );

              if (response.data && response.data.data && response.data.data.url) {
                imageUrls.push(response.data.data.url);
              } else {
                console.error('ImgBB upload did not return a valid URL', response.data);
                return res.status(502).json({ message: 'Image upload failed', error: 'Invalid response from ImgBB' });
              }
            } catch (uploadError) {
              console.log('ImgBB Error Response:', uploadError.response?.data || uploadError.message);
              return res.status(502).json({ message: 'Image upload failed', error: uploadError.message });
            }
          }
        }

        if (imageUrls.length === 0) {
            return res.status(400).json({ message: 'لم يتم رفع الصور بنجاح، يرجى المحاولة مرة أخرى' });
          }
     // إذا تم رفع صور جديدة، قم بتحديث الحقل image
         await Images.deleteMany({});

         await Images.create({image: imageUrls});
        
      




 res.status(201).json({message : "تم تحميل الصوره بنجاح" , imageUrls})
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

return app;
} 
export default PostImage ;
