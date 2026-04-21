# ☁️ Cloud File Upload & Sharing System

This is a cloud-based file upload system built using AWS EC2, AWS S3, and Node.js.

## 🚀 Features
- Upload files to AWS S3
- Get list of uploaded files
- Access files using public URLs

## 🛠️ Tech Stack
- Node.js
- Express.js
- AWS EC2
- AWS S3
- Multer

## ⚙️ How to Run

1. Clone the repo
git clone https://github.com/vighnaraj107/cloud-file-upload.git

2. Go inside folder
cd cloud-file-upload

3. Install dependencies
npm install

4. Run server
node server.js

## 🌐 API Endpoints

GET /files → Get all uploaded files  
POST /upload → Upload file  

## 📸 Output Example

[
  {
    "name": "file.pdf",
    "url": "https://your-bucket.s3.amazonaws.com/file.pdf"
  }
]

## 👨‍💻 Author
Vighnaraj Kakade