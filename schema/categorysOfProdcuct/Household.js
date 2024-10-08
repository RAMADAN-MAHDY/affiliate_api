import mongoose from 'mongoose';

const Schema =  mongoose.Schema ; 

const Household = new Schema({
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
    commition :{
        type: String,
        require: true
    },

}) 


const Households = mongoose.model('Household', Household);

export default Households;