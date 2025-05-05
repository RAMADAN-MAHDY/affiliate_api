import express from 'express';
import Mix from '../../schema/categorysOfProdcuct/all.js';
import Cosmetic from '../../schema/categorysOfProdcuct/Cosmetics.js';
import Ratans from '../../schema/categorysOfProdcuct/ratan.js';
import Households from '../../schema/categorysOfProdcuct/Household.js';
import Clothess from '../../schema/categorysOfProdcuct/clothes.js';
import SparePartss from '../../schema/categorysOfProdcuct/spareParts.js';
import qs from 'qs';
import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const IMGBB_API_KEY = process.env.IMGBB_API_KEY; // مفتاح الـ API من البيئة

const PostProducts = () => {
  const app = express();
  app.use(express.json());

  // Multer setup for handling file uploads
  const storage = multer.memoryStorage(); // تخزين الصورة في الذاكرة مؤقتًا
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // حجم الصورة محدود بـ 5MB
    fileFilter: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      if (ext === 'jpeg' || ext === 'png' || ext === 'jpg') {
        cb(null, true); // صورة مسموحة
      } else {
        cb(new Error('Only jpg, jpeg, and png are allowed'), false); // صورة غير مسموحة
      }
    },
  });

  const validateProductData = (req, res, next) => {
    const { address, details, price, commition } = req.body;

    if (!address || !details || !price || !commition) {
      return res.status(400).json({ error: 'الحقول المطلوبة مفقودة' });
    }
    next();
  };

  const createProductByCategory = async (category, productData) => {
    switch (category) {
      case '1': // Cosmetic
        return await Cosmetic.create(productData);
      case '2': // Clothess
        return await Clothess.create(productData);
      case '3': // Households
        return await Households.create(productData);
      case '4': // Ratans
        return await Ratans.create(productData);
      case '5': // SparePartss
        return await SparePartss.create(productData);
      default:
        return await Mix.create({ ...productData, category });
    }
  };

  app.post('/products/:category', upload.array('images', 5), validateProductData, async (req, res) => {
    try {
      const { category } = req.params;
      const productData = req.body;

      let imageUrls = [];

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

      // Add imageUrls to productData
      const updatedProductData = { ...productData, imageUrls };

      const createdProduct = await createProductByCategory(category, updatedProductData);

      return res.status(200).json({ message: 'تم انشاء المنتج بنجاح', product: createdProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return app;
};

export default PostProducts;
