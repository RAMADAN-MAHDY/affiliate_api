import express from 'express';
import Cosmetic from '../../schema/categorysOfProdcuct/Cosmetics.js';
import Ratans from '../../schema/categorysOfProdcuct/ratan.js';
import Households from '../../schema/categorysOfProdcuct/Household.js';
import Clothess from '../../schema/categorysOfProdcuct/clothes.js';
import SparePartss from '../../schema/categorysOfProdcuct/spareParts.js';
import Mix from '../../schema/categorysOfProdcuct/all.js';
import multer from 'multer';
import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

const storage = multer.memoryStorage();
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

const PutProducts = () => {
  const app = express();
  app.use(express.json());

  const updateProductByCategory = async (category, id, formData) => {
    let updateFields = {};

    for (let field of ['image', 'address', 'details', 'price', 'newprice', 'commition']) {
      if (formData[field] !== undefined) {
        updateFields[field] = formData[field];
      }
    }

    switch (category) {
      case '1':
        return await Cosmetic.findByIdAndUpdate(id, updateFields, { new: true });
      case '2':
        return await Clothess.findByIdAndUpdate(id, updateFields, { new: true });
      case '3':
        return await Households.findByIdAndUpdate(id, updateFields, { new: true });
      case '4':
        return await Ratans.findByIdAndUpdate(id, updateFields, { new: true });
      case '5':
        return await SparePartss.findByIdAndUpdate(id, updateFields, { new: true });
      case '6':
        return await Mix.findByIdAndUpdate(id, updateFields, { new: true });
      default:
        throw new Error('فئة غير صحيحة');
    }
  };

  const validateProductData = (req, res, next) => {
    const { image, address, details, price, newprice, commition } = req.body;
    if (
      image === undefined &&
      address === undefined &&
      details === undefined &&
      price === undefined &&
      newprice === undefined &&
      commition === undefined
    ) {
      return res.status(400).json({ error: 'على الأقل يجب تقديم حقل واحد لتحديثه' });
    }
    next();
  };

  app.put(
    '/products/:category/:id',
    upload.array('images', 5), // دعم رفع الصور
    validateProductData,
    async (req, res) => {
      try {
        const { category, id } = req.params;
        const formData = req.body;

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

        // إذا تم رفع صور جديدة، قم بتحديث الحقل image
        if (imageUrls.length > 0) {
          formData.image = imageUrls;
        }

        const updatedProduct = await updateProductByCategory(category, id, formData);

        return res.status(200).json({ message: 'تم تعديل المنتج بنجاح', product: updatedProduct });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return app;
};

export default PutProducts;
