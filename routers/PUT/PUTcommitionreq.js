import express from 'express';
import Conditions from '../../schema/condition.js';
import sendMailbyCommition from '../../gemailconnected/gemailConnect.js';

const PUTcommitionreq = ()=> {
   const app = express();
   app.use(express.json());

   app.put('/condition/:code/:conditionId', async (req, res) => {
    try {
        const { code, conditionId } = req.params;
        const { commitionreq } = req.body;

        if (!commitionreq) {
            return res.status(400).json({ error: 'State is required.' });
        }

        const conditions = await Conditions.find({ code });

        if (conditions.length === 0 ) {
            return res.status(404).json('Condition not found');
        }

          // ابحث عن العنصر الفرعي في كل وثيقة
  let foundSubCondition = null;
  for (let condition of conditions) {
      const subCondition = condition.conditions.id(conditionId);
      if (subCondition) {
        sendMailbyCommition(code);
          // تعيين القيمة الجديدة للـ state
          subCondition.commitionreq = commitionreq;
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

export default PUTcommitionreq;