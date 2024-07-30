import express from 'express';
import Conditions from '../../schema/condition.js';
// import Notification from '../../schema/notification.js';
import nodemailer from 'nodemailer';

const PostConditions = () => {
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
      const { name, code, stateDetail } = req.body;

      if (!stateDetail) {
        return res.status(400).json({ error: 'الحقول المطلوبة مفقودة' });
      }
      
      if (stateDetail.image) {
        stateDetail.image = await processImage(stateDetail.image);
      }

      // إضافة الوقت الحالي إلى stateDetail
      stateDetail.timestamp = new Date();

      // البحث عن السجل الموجود باستخدام الكود
      let existingCondition = await Conditions.findOne({ code }).sort({ _id: -1 });

      if (existingCondition && existingCondition.conditions.length < 20) {
        // إذا كان السجل موجودًا، أضف stateDetail إلى الحقل conditions
        existingCondition.conditions.push(stateDetail);
        await existingCondition.save();
      } else {
        // إذا لم يكن السجل موجودًا، قم بإنشاء سجل جديد
        await Conditions.create({ code, name, conditions: [stateDetail] });
      }

      // إعداد البريد الإلكتروني
      const mailOptions = {
        from: 'ramadanmahdy45@gmail.com',
        to: ['ramadanmahdy45@gmail.com', 'ramadanmahdy52@gmail.com'],
        subject: `حالة جديدة: ${name}/${code}`,
        text: `تم إضافة حالة جديدة من ${name} بكود ${code}.`,
        html: `<p>تم إضافة حالة جديدة من <strong>${name}</strong> بكود <strong>${code}</strong>.</p>`
      };

      // إرسال البريد الإلكتروني
      await transporter.sendMail(mailOptions);
      console.log('Message sent:', mailOptions);

      // إرسال استجابة واحدة فقط
      res.status(200).json({ message: 'تمت إضافة تفاصيل الحالة بنجاح' });
    } catch (error) {
      // التأكد من عدم إرسال استجابة أخرى إذا كانت الاستجابة قد أرسلت بالفعل
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  });

  return app;
}

export default PostConditions;
