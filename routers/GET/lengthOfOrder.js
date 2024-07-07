import express from 'express';
import Conditions from '../../schema/condition.js';


const Lengthoforder = ()=>{
const app = express();
app.use(express.json());

app.get('/lengthoforder', async (req, res) => {
    try {
        const conditions = await Conditions.find();

        if (conditions && conditions.length > 0) {
            const codeList = conditions.map(condition => condition.code);
            
            const findPromises = codeList.map(async code => {
                const findcode = await Conditions.findOne({ code });
                if (findcode) {
                    return { code, conditionsLength: findcode.conditions.length };
                } else {
                    console.log(`Code ${code} not found in conditions`);
                    return null; // or handle as needed
                }
            });

            const results = await Promise.all(findPromises);
            return res.status(200).json(results.filter(result => result !== null));
        } else {
            return res.status(404).json({ message: 'No conditions found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

return app;
}
export default Lengthoforder;