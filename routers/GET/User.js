import express from 'express';
import User from '../../schema/createuser.js';


const Users = ()=>{
const app = express();
app.use(express.json());


app.get('/user', async (req, res) => {
    try {
      const conditions = await User.find();
      res.json(conditions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve conditions' });
    }
  });
return app;  


}
export default Users