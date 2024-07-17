import mongoose from 'mongoose';

const Schema =  mongoose.Schema ; 

const Image = new Schema({
    image :{
        type: [String],
        require: true
    },
    label :{
        type: String,   
    },
    caption :{
        type: String,
    },
}) 


const Images = mongoose.model('Image', Image);

export default Images;