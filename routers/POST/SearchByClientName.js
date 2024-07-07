import express from 'express';
import Conditions from '../../schema/condition.js';
import removeAccents  from "remove-accents";

const SearchByClientName = ()=>{
    const app = express();
    app.use(express.json());

    const normalizeArabic = (text) => {
        // إزالة التشكيل
        const textWithoutAccents = removeAccents(text);
        // إزالة المسافات البيضاء الزائدة
        const normalizedText = textWithoutAccents.trim();
        return normalizedText;
    };


     const findCodeByClientName = async (clientName) => {
        try {
            // تطبيع الاسم العربي
            const normalizedClientName = normalizeArabic(clientName);
    
            const result = await Conditions.aggregate([
                { $match: { 'conditions.clientname': normalizedClientName } },
                { $unwind: '$conditions' },
                { $match: { 'conditions.clientname': normalizedClientName } },
                { $project: { code: 1, _id: 0 } }
            ]);
    
            if (result.length > 0) {
                console.log('Code found:', result[0].code);
                return result[0].code;
            } else {
                console.log('Client not found');
                return null;
            }
        } catch (error) {
            console.error("Error finding client by name:", error);
            throw error;
        }
    };
    
    app.post('/search/:name' , async (req, res)=>{
        try{
            const {name } = req.params;
     
            if(!name){
            res.status(500).json({message :"Name parameter is missing" });
    
            }
            const decodedName = decodeURIComponent(name).trim();
            const code = await findCodeByClientName(decodedName);
    
                if (code) {
                    console.log('Code:', code);
                    res.status(200).json({code});
                } else {
                    console.log('Code not found');
                    res.status(500).json({message:"Client not found in the database"});
                }
    
        }catch(error){
            res.status(500).json({ error: error.message });
        }
    
    });

return app
}

export default SearchByClientName; 