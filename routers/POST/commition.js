import express from 'express';
import Commitionschma from '../../schema/commitionadmin.js';


const Commition =()=>{
const app = express();
app.use(express.json());

app.post("/Commitionschma", async (req, res) => {
    try {
        const { commition , id } = req.body;

        if (!id || !commition) {
            return res.status(400).json({ err: 'Code and commition are required' });
        }

        const commitionfond = await Commitionschma.findOne({ id });

        if (commitionfond) {
            commitionfond.commition = commition;
            await commitionfond.save();
            return res.status(200).json(commitionfond); // إرسال الاستجابة وتوقف التنفيذ
        } else {
            console.log(id + "done-------");
            const newCommition = await Commitionschma.create({ commition ,id });
            return res.status(200).json(newCommition); // إرسال الاستجابة وتوقف التنفيذ
        }
    } catch (err) {
        console.error(err); // طباعة الخطأ للتصحيح
        return res.status(500).json({ err: 'Failed to retrieve conditions' });
    }
});

return app;

} 
export default Commition;