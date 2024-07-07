import express from 'express';
import Conditions from '../../schema/condition.js';
import Notification from '../../schema/notification.js';
import nodemailer from 'nodemailer';

 const PostConditions = ()=>{
 const app = express();
       app.use(express.json());
    // إعداد nodemailer باستخدام حساب Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ramadanmahdy45@gmail.com',
      pass: 'zulqwsnqkyxhjure' // استخدم كلمة مرور التطبيقات الخاصة بك هنا
    }
  });

    app.post('/condition', async (req, res) => {
        try {
            const { name , code , stateDetail, } = req.body;
       
            if (!stateDetail) {
                return res.status(400).json({ error: 'الحقول المطلوبة مفقودة' });
            }
    
            // إضافة الوقت الحالي إلى stateDetail
            stateDetail.timestamp = new Date();
    
            // البحث عن السجل الموجود باستخدام الكود
            let existingCondition = await Conditions.findOne({ code });
    
            if (existingCondition) {
                // إذا كان السجل موجودًا، أضف stateDetail إلى الحقل conditions
                existingCondition.conditions.push(stateDetail);
                await existingCondition.save();
            } else { 
                // إذا لم يكن السجل موجودًا، قم بإنشاء سجل جديد
                await Conditions.create({ code, name, conditions: [stateDetail] });
            }
    
            //sent message to gmail
            const mailOptions = {
                from: 'ramadanmahdy45@gmail.com', // عنوان المرسل
                to: ['ramadanmahdy45@gmail.com' , 'ramadanmahdy52@gmail.com'], // عنوان المستلم (حساب Gmail الخاص بك)
                subject: `حالة جديدة: ${name}/${code}`, // موضوع البريد
                text: `تم إضافة حالة جديدة من ${name} بكود ${code}.`, // نص البريد
                html: `<p>تم إضافة حالة جديدة من <strong>${name}</strong> بكود <strong>${code}</strong>.</p>` // محتوى HTML للبريد
            };
            
    
            const info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            res.send(`Email sent successfully: ${info.messageId}`);
    
    // إرسال البريد الإلكتروني
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('حدث خطأ أثناء إرسال البريد الإلكتروني:', error);
        } else {
          console.log('تم إرسال البريد الإلكتروني بنجاح:', info.response);
        }})
    
            const notification = new Notification({
                message: `تمت إضافة حالة جديدة بكود ${code}`,
            });
            await notification.save();
    
            console.log('إرسال حدث حالة جديدة بالكود:', code);
            io.emit('new-condition', { code });
    
            res.status(200).json({ message: 'تمت إضافة تفاصيل الحالة بنجاح' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

return app;
    
}
export default PostConditions;