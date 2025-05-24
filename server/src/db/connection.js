import mongoose from 'mongoose';
import { initGridFS } from './gridfs.js';

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    
    // Initialize GridFS with the connection
    initGridFS(connection.connection);
    
    return connection;
  } catch (error) {
    console.log('MongoDB connection error: ', error);
    process.exit(1);
  }
};

export default connectToDB;