
import nodemailer from 'nodemailer';

// إعداد nodemailer باستخدام حساب Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ramadanmahdy45@gmail.com',
      pass: 'zulqwsnqkyxhjure' // استخدم كلمة مرور التطبيقات الخاصة بك هنا
    }
  });

  const sendMailbyCommition = async (code)=>{
console.log(code);

    const mailOptions = {
        from: 'ramadanmahdy45@gmail.com', // عنوان المرسل
        to: ['ramadanmahdy45@gmail.com' , 'ramadanmahdy52@gmail.com'], // عنوان المستلم (حساب Gmail الخاص بك)
        subject: `  طلب العموله من الكود :/${code}`, // موضوع البريد
        text: `  طلب العموله  بكود ${code}.`, // نص البريد
        html: `<p>تم إضافة طلب عموله جديد من الكود <strong>${code}</strong>.</p>` // محتوى HTML للبريد
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('حدث خطأ أثناء إرسال البريد الإلكتروني:', error);
        } else {
          console.log('تم إرسال البريد الإلكتروني بنجاح:', info.response);
        }})
  }




  const sendMailbyOrder = async ({code })=>{
    const mailOptions = {
        from: 'ramadanmahdy45@gmail.com', // عنوان المرسل
        to: ['ramadanmahdy45@gmail.com' , 'ramadanmahdy52@gmail.com'], // عنوان المستلم (حساب Gmail الخاص بك)
        subject: `    طلب اوردر جديد من ${names} :/${code}`, // موضوع البريد
        text: `     قام بارسال طلب جديد ${names}.`, // نص البريد
        html: `<p>تم إضافة طلب عموله جديد من الكود <strong>${code}</strong>.</p>` // محتوى HTML للبريد
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('حدث خطأ أثناء إرسال البريد الإلكتروني:', error);
        } else {
          console.log('تم إرسال البريد الإلكتروني بنجاح:', info.response);
        }})
  }

  export {sendMailbyOrder}
  export default sendMailbyCommition;