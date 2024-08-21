import express from 'express';
import Cosmetic from '../../schema/categorysOfProdcuct/Cosmetics.js';
import Ratans from '../../schema/categorysOfProdcuct/ratan.js';
import Households from '../../schema/categorysOfProdcuct/Household.js';
import Clothess from '../../schema/categorysOfProdcuct/clothes.js';
import SparePartss from '../../schema/categorysOfProdcuct/spareParts.js';
import Mix from '../../schema/categorysOfProdcuct/all.js';
const DeleteProducts = () => {
    const app = express();
    app.use(express.json());
  
    const deleteProductByCategory = async (category, id) => {
        switch (category) {
            case "1": // Cosmetic
                return await Cosmetic.findByIdAndDelete(id);
            case "2": // Clothess
                return await Clothess.findByIdAndDelete(id);
            case "3": // Households
                return await Households.findByIdAndDelete(id);
            case "4": // Ratans
                return await Ratans.findByIdAndDelete(id);
            case "5": // SparePartss
                return await SparePartss.findByIdAndDelete(id);
                case "6": // SparePartss
                return await Mix.findByIdAndDelete(id);
            default:
                throw new Error('فئة غير صحيحة');
        }
    };
  
    app.delete('/products/:category/:id', async (req, res) => {
        try {
            const { category, id } = req.params;
            const deletedProduct = await deleteProductByCategory(category, id);

            if (!deletedProduct) {
                return res.status(404).json({ message: "المنتج غير موجود" });
            }
    
            return res.status(200).json({ message: "تم حذف المنتج بنجاح", product: deletedProduct });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return app;
}

export default DeleteProducts;
