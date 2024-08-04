import express from 'express';
import Conditions from '../../schema/condition.js';

const ChangeState = ()=> {
   const app = express();
   app.use(express.json());

   app.put('/condition/state/:code/:conditionId', async (req, res) => {
    try {
        const { code, conditionId } = req.params;
        const { state } = req.body;

        if (!state) {
            return res.status(400).json({ error: 'State is required.' });
        }

        const conditions = await Conditions.find({ code });

        if (conditions.length === 0) {
            return res.status(404).json('Condition not found');
        }

  // ابحث عن العنصر الفرعي في كل وثيقة
  let foundSubCondition = null;
  for (let condition of conditions) {
      const subCondition = condition.conditions.id(conditionId);
      if (subCondition) {
          // تعيين القيمة الجديدة للـ state
          subCondition.state = state;
          await condition.save(); // حفظ التعديلات في الوثيقة
          foundSubCondition = subCondition;
          break; // أوقف البحث بعد العثور على العنصر الفرعي
      }
  }

  if (!foundSubCondition) {
      return res.status(404).json('Sub-condition not found');
  }

  res.status(200).json(foundSubCondition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
return app;
}

export default ChangeState;