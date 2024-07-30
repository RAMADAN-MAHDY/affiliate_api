
import express from 'express';
import Mix from '../../schema/categorysOfProdcuct/all.js';
import Cosmetic from '../../schema/categorysOfProdcuct/Cosmetics.js';
import Ratans from '../../schema/categorysOfProdcuct/ratan.js';
import Households from '../../schema/categorysOfProdcuct/Household.js';
import Clothess from '../../schema/categorysOfProdcuct/clothes.js';
import SparePartss from '../../schema/categorysOfProdcuct/spareParts.js';

const PostProducts = () => {
    const app = express();
    app.use(express.json());
  
    const validateProductData = (req, res, next) => {
      const { image, address, details, price} = req.body;
      if (!image || !address || !details || !price ) {
        return res.status(400).json({ error: 'الحقول المطلوبة مفقودة' });
      }
      next();
    };
  
    const createProductByCategory = async (category, productData) => {
        console.log(category)
      switch (category) {
        case "1": // Cosmetic
          return await Cosmetic.create(productData);
        case "2": // Clothess
          return await Clothess.create(productData);
        case "3": // Households
          return await Households.create(productData);
        case "4": // Ratans
          return await Ratans.create(productData);
        case "5": // SparePartss
          return await SparePartss.create(productData);
        default:
          return await Mix.create({ ...productData, category });
      }
    };
  
    app.post('/products/:category', validateProductData, async (req, res) => {
      try {
        const { category } = req.params;
        const productData = req.body;
  
        const createdProduct = await createProductByCategory(category, productData);
  
        return res.status(200).json({ message: "تم انشاء المنتج بنجاح", product: createdProduct });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

  return app;
}

export default PostProducts;
