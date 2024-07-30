import express from 'express';
import Images from '../../schema/imagesSlider.js';


const imagesSlider = ()=>{
const app = express();
app.use(express.json());


app.get('/Images', async (req, res) => {
    try {
      const Image = await Images.find();
      res.json(Image);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve conditions' });
    }
  });
return app;  


}
export default imagesSlider;