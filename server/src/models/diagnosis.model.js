import mongoose from "mongoose";

const SoilDiagnosisSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
    },
    reportFile:{
        type:String
    }
},{timestamps:true})


export const SoilDiagnosisModel=mongoose.model("diagnosis",SoilDiagnosisSchema)