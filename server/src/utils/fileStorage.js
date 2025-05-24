import { getGFS } from '../db/gridfs.js';
import { createReadStream, unlink } from 'fs';
import mongoose from 'mongoose';
import path from 'path';

// Upload file to GridFS
export const uploadToGridFS = async (filePath) => {
  try {
    if (!filePath) return null;
    
    console.log("Uploading file to GridFS:", filePath);
    const filename = path.basename(filePath);
    const contentType = determineContentType(filename);
    console.log("File content type:", contentType);
    
    // Create a read stream from the file path
    const readStream = createReadStream(filePath);
    
    // Get the GridFS bucket
    const bucket = getGFS();
    console.log("GridFS bucket created");
    
    // Create an upload stream to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        uploadDate: new Date()
      }
    });
    
    // Create a promise to handle the upload completion
    return new Promise((resolve, reject) => {
      readStream.pipe(uploadStream)
        .on('error', (error) => {
          console.error("GridFS upload stream error:", error);
          unlink(filePath, () => {});
          reject(error);
        })
        .on('finish', (file) => {
          console.log("File uploaded to GridFS successfully:", uploadStream.id);
          unlink(filePath, () => {});
          resolve({
            id: uploadStream.id,
            filename: uploadStream.filename,
          });
        });
    });
  } catch (error) {
    console.error('Error uploading to GridFS:', error);
    if (filePath) unlink(filePath, () => {});
    return null;
  }
};

// Helper to determine content type
const determineContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  switch(ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
};