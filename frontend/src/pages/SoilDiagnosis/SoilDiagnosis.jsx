import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';

const SoilDiagnosis = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile.type.includes('application/pdf')) {
            alert('Please select a PDF file');
            return;
        }
        setSelectedFile(selectedFile);

        // Generate a temporary URL for preview (optional)
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
        console.log(selectedFile)
    };

    return (
        <div>
            <input type="file" id="fileInput" onChange={handleFileUpload} accept=".pdf" />
            {previewUrl && (
                <object data={previewUrl} type="application/pdf" width="100%" height="400px">
                    <p>Your PDF preview will be displayed here.</p>
                </object>
            )}
        </div>
    );
};


export default SoilDiagnosis;
