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

        const condition = await Conditions.findOne({ code });

        if (!condition) {
            return res.status(404).json('Condition not found');
        }

        const subCondition = condition.conditions.id(conditionId);
        if (!subCondition) {
            return res.status(404).json('Sub-condition not found');
        }

        subCondition.state = state;

        await condition.save();

        res.status(200).json(subCondition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
return app;
}

export default ChangeState;