import mongoose from 'mongoose';

const Schema =  mongoose.Schema ; 

const Emage = new Schema({
    image :{
        type: [String],
        require: true
    },
}) 


const Emages = mongoose.model('Emage', Emage);

export default Emages;