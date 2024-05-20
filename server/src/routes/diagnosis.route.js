import express from 'express'
import {upload} from '../middlewares/multer.middleware.js';
import { SoilDiagnosisModel } from '../models/diagnosis.model.js';

const DiagnosisRouter=express.Router();


DiagnosisRouter.post('/soil',upload.single("report"),(req,res)=>{

    console.log(req.file);
    console.log(req.body);
    res.send("successfully sent")

})

export default DiagnosisRouter;
