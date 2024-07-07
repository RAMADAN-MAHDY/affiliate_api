import express from 'express';
import Conditions from '../../schema/condition.js';


const DeleteOrder =()=>{
    const app = express()
    app.use(express.json());

    app.delete('/item/:code/:id', async (req, res) => {
        try {
            const code = req.params.code;
            const id = req.params.id;
    
            // تحديث الكائن وسحب العنصر من المصفوفة
            const updatedCondition = await Conditions.updateOne(
                { code: code },
                { $pull: { conditions: { _id: id } } }
            );
    
            if (updatedCondition.nModified === 0) {
                return res.status(404).send('العنصر غير موجود');
            }
    
            res.send('تم حذف العنصر بنجاح.');
        } catch (error) {
            res.status(500).send('حدث خطأ أثناء محاولة الحذف');
        }
    });
    return app;

}

export default DeleteOrder;