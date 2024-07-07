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

        const condition = await Conditions.findOne({ code });

        if (!condition) {
            return res.status(404).json('Condition not found');
        }

        const subCondition = condition.conditions.id(conditionId);
        if (!subCondition) {
            return res.status(404).json('Sub-condition not found');
        }
        sendMailbyCommition(code);

        subCondition.commitionreq = commitionreq;

        await condition.save();

        res.status(200).json(subCondition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
return app;
}

export default PUTcommitionreq;