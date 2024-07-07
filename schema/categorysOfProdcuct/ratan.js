import mongoose from 'mongoose';

const Schema =  mongoose.Schema ; 

const Ratan = new Schema({
    image :{
        type: [String],
        require: true
    },
    address :{
        type: String,
        require: true
    },
    details :{
        type: String,
        require: true
    },
    price :{
        type: Number,
        require: true
    },
    newprice :{
        type: Number,
    },
  
}) 

const Ratans = mongoose.model('Ratan', Ratan);

export default Ratans;
