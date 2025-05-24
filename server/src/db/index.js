import mongoose from 'mongoose'
import { initGridFS } from './gridfs.js'  // Make sure this import exists

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected Successfully !! DB HOST: ${connectionInstance.connection.host}`)
        
        // Initialize GridFS with the connection
        initGridFS(connectionInstance.connection)
        console.log("GridFS initialized successfully")
        
        return connectionInstance
    } catch (error) {
        console.log("MongoDB Connection Failed ", error)
        process.exit(1)
    }
}

export default connectDB