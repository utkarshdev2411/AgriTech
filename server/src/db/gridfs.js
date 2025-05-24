import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// Create a variable to store the GridFS bucket instance
let gfs;

// Function to initialize GridFS when DB connection is established
const initGridFS = (connection) => {
  try {
    gfs = new GridFSBucket(connection.db, {
      bucketName: 'uploads'
    });
    console.log('GridFS initialized successfully');
    return gfs;
  } catch (error) {
    console.error('Error initializing GridFS:', error);
    return null;
  }
};

// Get the GridFS bucket instance
const getGFS = () => {
  if (!gfs) {
    throw new Error('GridFS not initialized. Call initGridFS first.');
  }
  return gfs;
};

export { initGridFS, getGFS };