import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import Socketio from './socket_io/socket_io.js';

// -----------------POST----------------//
import PostConditions  from './routers/POST/condition.js';
import createUser from './routers/POST/createuser.js';
import Login from './routers/POST/login.js';
import Commition from './routers/POST/commition.js';
import SearchByClientName from './routers/POST/SearchByClientName.js' ;
import PostProducts from './routers/POST/postProduct.js';
import PostImage from './routers/POST/imageSlider.js' ;

// -----------------DELETE-----------//
import DeleteOrder from './routers/DELETE/order.js';

// -----------------PUT---------------//
import PUTcommitionreq from './routers/PUT/PUTcommitionreq.js';
import ChangeState from './routers/PUT/changeState.js';
import ChangeCnodition from './routers/PUT/changeCondition.js';

// ------------------GET---------------//
import DetailsCondition from './routers/GET/getDetailsCondition.js';
import Lengthoforder from './routers/GET/lengthOfOrder.js';
import Commitionschmas from './routers/GET/Commitionschma.js';
import Users from './routers/GET/User.js';
import GetProdects from './routers/GET/productes.js';

const app = express()
const port = 5000;

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  
app.use(cors(corsOptions));

app.use((req, res, next) => {
    const contentLength = parseInt(req.get('content-length'), 10);
    console.log(`حجم البيانات: ${contentLength} bytes`);
    next();
  });

  // زيادة الحد الأقصى لحجم البيانات المسموح به
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true, parameterLimit: 50000}));

connectDB();

Socketio();
// ---------------------POST--------------------------//
//login 
app.use('/api' ,Login());

//create an account 
app.use("/api" ,createUser());

//post conditon to conditions array

app.use("/api" ,PostConditions());

// post commition 
app.use('/api' ,Commition()) ;

// searchByClientName 
app.use('/api' ,SearchByClientName()) ;

//  post products
app.use('/api' ,PostProducts()) ;

// add image slider 
app.use('/api' , PostImage());

// ----------------------------------------------------
// ------------------DELETE---------------------------//
// delete order by id and code 
app.use('/api' ,DeleteOrder()) ;
// ----------------------------------------------------
// ------------------PUT------------------------------//
// put commitionreq data 
app.use('/api' ,PUTcommitionreq()) ;

// change state 
app.use('/api' , ChangeState());

//change condition By admin
app.use('/api' , ChangeCnodition());
// ---------------------------------------------------
// -----------------GET------------------------------//
// get datails condition
app.use('/api' , DetailsCondition());
app.use('/api' , Lengthoforder());
app.use('/api' , Commitionschmas());
app.use('/api' , Users());
app.use('/api' , GetProdects());
// ----------------------------------------------------

app.get('/', (req, res) => {

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// api gimini key     AIzaSyBA-GGARuigekKJiVClyv40Ez20tladO3Y

// data api mongodb key    SPdzfo3YIImKEWWqHlq9jFVYXEEvbsi9PzZif4aSgFbqxs4ofOxXU7ERhMJVyk66