# Crop and Soil Diagnosis Platform for Farmers

This project is an innovative web application designed to assist farmers in diagnosing crop and soil conditions using advanced machine learning and generative AI technologies. It provides a comprehensive platform for farmers to connect with a supportive community, access expert knowledge, and utilize tools for diagnosing crop diseases and soil conditions.

## Key Features

### 1. User Authentication and Profile Management
- Secure user registration and login functionality.
- Profile management features, including updating personal information, changing avatars, and adding social media links.

### 2. Crop Diagnosis
- Upload images of crops for disease diagnosis.
- Utilizes a pre-trained model hosted on Hugging Face to identify crop diseases.

### 3. Soil Diagnosis
- Upload soil reports in PDF format, along with additional details (e.g., rainfall, temperature, irrigation techniques).
- Processes uploaded reports to generate detailed analyses using generative AI.

### 4. Community Engagement
- Create posts, comment, and engage with fellow farmers in the community section.

## Generative AI Integration

The application incorporates cutting-edge generative AI to analyze soil reports and crop conditions with remarkable accuracy. Below are the core components:

### PDF Content Extraction
- Extracts content from uploaded PDF soil reports using `pdf2image` and `PyPDF2`.
- Processes the extracted content to identify relevant numerical data and textual information.

### Vector Storage and Similarity Search
- Splits extracted data into chunks and stores them in a vector database using FAISS (Facebook AI Similarity Search).
- Performs similarity searches on stored vectors to retrieve relevant information based on user queries.

### Generative AI for Analysis
- Leverages Google Generative AI to create detailed analyses and summaries of extracted data.
- Constructs prompts to query the AI model for insights and actionable recommendations.

### Interactive Chat
- Provides an AI-powered chat interface where users can ask questions about their crops and soil conditions.
- AI generates responses using stored data and advanced NLP capabilities.

## Technical Stack

### Frontend
- **Frameworks and Libraries**: React, Redux, React Router
- **Styling**: Tailwind CSS

### Backend
- **Runtime and Framework**: Node.js, Express
- **Database**: MongoDB, Mongoose

### AI and Machine Learning
- **Technologies**: Google Generative AI, LangChain, FAISS, Hugging Face API
- **Python Integration**: Flask (for Python-based AI processing)

### Other Tools
- **Utilities**: Axios, Multer, Cloudinary

## Overview

This project exemplifies the seamless integration of modern web technologies with advanced AI capabilities to deliver valuable tools and insights for the agricultural community. It empowers farmers to make data-driven decisions, connect with their peers, and optimize their crop and soil health efficiently.
