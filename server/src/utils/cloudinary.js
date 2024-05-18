import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            secure: true
        })
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if(!publicId) return null
        
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
            secure: true
        })

        return response
    } catch (error) {
        console.error("deleteFromCloudinary: Error", error);
        return null
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}