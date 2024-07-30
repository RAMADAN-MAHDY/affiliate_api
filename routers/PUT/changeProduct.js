import express from 'express';
import Cosmetic from '../../schema/categorysOfProdcuct/Cosmetics.js';
import Ratans from '../../schema/categorysOfProdcuct/ratan.js';
import Households from '../../schema/categorysOfProdcuct/Household.js';
import Clothess from '../../schema/categorysOfProdcuct/clothes.js';
import SparePartss from '../../schema/categorysOfProdcuct/spareParts.js';

const PutProducts = () => {
    const app = express();
    app.use(express.json());
  
    const updateProductByCategory = async (category, id, productData) => {
        let updateFields = {};

        // Iterate through productData and pick only the fields that exist
        for (let field of ['image', 'address', 'details', 'price' , "newprice"]) {
            if (productData[field] !== undefined) {
                updateFields[field] = productData[field];
            }
        }

        switch (category) {
            case "1": // Cosmetic
                return await Cosmetic.findByIdAndUpdate(id, updateFields, { new: true });
            case "2": // Clothess
                return await Clothess.findByIdAndUpdate(id, updateFields, { new: true });
            case "3": // Households
                return await Households.findByIdAndUpdate(id, updateFields, { new: true });
            case "4": // Ratans
                return await Ratans.findByIdAndUpdate(id, updateFields, { new: true });
            case "5": // SparePartss
                return await SparePartss.findByIdAndUpdate(id, updateFields, { new: true });
            default:
                throw new Error('فئة غير صحيحة');
        }
    };

    const validateProductData = (req, res, next) => {
        const { image, address, details, price ,newprice} = req.body;
        if (image === undefined && address === undefined && details === undefined && price === undefined && newprice === undefined ) {
            return res.status(400).json({ error: 'على الأقل يجب تقديم حقل واحد لتحديثه' });
        }
        next();
    };
  
    app.put('/products/:category/:id', validateProductData, async (req, res) => {
        try {
            const { category, id } = req.params;
            const productData = req.body;
    
            const updatedProduct = await updateProductByCategory(category, id, productData);
    
            return res.status(200).json({ message: "تم تعديل المنتج بنجاح", product: updatedProduct });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return app;
}

export default PutProducts;
