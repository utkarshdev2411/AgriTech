
import express from 'express'
import {upload} from '../middlewares/multer.middleware.js';
import { SoilDiagnosisModel } from '../models/diagnosis.model.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploads = multer({ dest: 'uploads/' });

const DiagnosisRouter=express.Router();





DiagnosisRouter.post('/soil',uploads.single("report"),(req,res)=>{

    console.log(req.file)
    console.log(req.file.filename)
    console.log({
        report:req.file.destination,
        data:req.body
    })

    const formData = req.body;
    const report = req.file;

    // Ensure 'uploads' directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    // Save form data to a JSON file
    fs.writeFileSync(path.join(uploadsDir, 'formData.json'), JSON.stringify(formData));

    // Move the report file to a new location
    fs.renameSync(report.path, path.join(uploadsDir,  'Test.pdf'));

    res.sendStatus(200);
})


export default DiagnosisRouter;
