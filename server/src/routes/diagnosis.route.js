import express from 'express'
import {upload} from '../middlewares/multer.middleware.js';

const DiagnosisRouter=express.Router();


DiagnosisRouter.post('/soil',upload.single("report"),(req,res)=>{

    console.log(req.file)
    res.send("successfully sent")

})




export default DiagnosisRouter;
