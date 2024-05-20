import mongoose from 'mongoose'

const connectDB = async () => {
    try {

        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)

        // const connectionInstance = await mongoose.connect("mongodb+srv://hackWithDelhi:hackWithDelhi@cluster0.f078rrl.mongodb.net/hackWithDelhi")

        console.log(`MongoDB Connected Successfully !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB Connection Failed ", error)
        process.exit(1)
    }
}

export default connectDB