import bcrypt from 'bcryptjs';
import express from 'express';
import admin from '../../schema/admin.js';

const creatAdmin = () => {
    const app = express();
    app.use(express.json());

    app.post('/admin', async (req, res) => {
        try {
            const { name, pass} = req.body;

            if (!name || !pass) {
                return res.status(400).json({ message: "جميع الحقول مطلوبة." });
            }

   
            const existingUser = await admin.findOne({ $or: [{ name }] });

            if (existingUser) {
                return res.status(409).json({ message: "البريد الإلكتروني أو الرمز مستخدم مسبقًا." });
            }

            // لتشفير الباسورد
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(pass, saltRounds);

            const newadmin = await admin.create({ name, pass: hashedPassword});
            return res.status(201).json({ message: "تم إنشاء الحساب بنجاح", admin: newadmin });

        } catch (err) {
            console.error("خطأ في تسجيل المستخدم:", err);
            return res.status(500).json({ message: "حدث خطأ أثناء تسجيل المستخدم." });
        }
    });

    return app;
};

export default creatAdmin;