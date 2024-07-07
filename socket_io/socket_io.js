import { Server } from "socket.io";
import { createServer } from 'node:http';
import express from 'express';


const Socketio = ()=>{

const app = express()

    const server = createServer(app);
    const io = new Server(server,{
        cors:{
            origin:'http://localhost:3000'
        }
    });

    io.on('connection', async (socket) => {
        console.log('عميل متصل:', socket.id);
    
        // إرسال الإشعارات غير المقروءة عند الاتصال
        const notifications = await Notification.find({ seenBy: { $ne: socket.id } });
        if (notifications.length > 0) {
            socket.emit('unread-notifications', notifications);
        }
    
        socket.on('disconnect', () => {
            console.log('عميل مفصول:', socket.id);
        });
    
        // تحديث الإشعارات كمقروءة
        socket.on('mark-as-read', async (notificationIds) => {
            await Notification.updateMany(
                { _id: { $in: notificationIds } },
                { $addToSet: { seenBy: socket.id } }
            );
        });
    });



}

   

export default Socketio ; 