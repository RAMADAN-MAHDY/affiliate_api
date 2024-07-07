import express from 'express';
import Conditions from '../../schema/condition.js';

const ChangeCnodition = ()=> {
   const app = express();
   app.use(express.json());

   app.put('/update/:id/:code', async (req, res) => {
    const { id, code } = req.params;
    const requestData = req.body;

    try {
        // إعداد كائن التحديث
        let updateFields = {};
        for (let key in requestData) {
            if (requestData.hasOwnProperty(key)) {
                updateFields[`conditions.$.${key}`] = requestData[key];
            }
        }

        // استخدام findOneAndUpdate لتحديث الحقول المحددة
        const updateResult = await Conditions.findOneAndUpdate(
            { code, 'conditions._id': id },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: 'User or condition not found' });
        }

        res.status(200).json({ message: "Data update successful", updatedCondition: updateResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

return app;
}

export default ChangeCnodition;