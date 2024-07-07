import mongoose from 'mongoose';

const uri = "mongodb+srv://ramadanmahdy786:6QexVzBviGbHDa5x@aflatestore.y8b0ki1.mongodb.net/?retryWrites=true&w=majority&appName=aflateStore";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
