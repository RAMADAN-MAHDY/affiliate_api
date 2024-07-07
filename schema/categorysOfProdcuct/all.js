import mongoose from 'mongoose';

const Schema =  mongoose.Schema ; 

const Mixs = new Schema({
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
    category :{
        type: String,

    }
}) 
const Mix = mongoose.model('Mixs', Mixs);

export default Mix;

