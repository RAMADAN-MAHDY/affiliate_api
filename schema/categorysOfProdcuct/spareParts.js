import mongoose from 'mongoose';

const Schema =  mongoose.Schema ; 

const SpareParts = new Schema({
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


const SparePartss = mongoose.model('SpareParts', SpareParts);

export default SparePartss;