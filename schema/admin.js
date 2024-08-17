import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

    "name":String,
    "pass":{
        type: String,
    required: true
    }  
})

const admin = mongoose.model('Admin' ,adminSchema );

export default admin;