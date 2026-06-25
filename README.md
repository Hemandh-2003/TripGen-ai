# 🌍 TripGen AI

## 🚀 Overview

TripGen AI is a full-stack MERN application that leverages Artificial Intelligence to simplify travel planning. Users can upload travel-related documents such as flight tickets, hotel bookings, and travel images, which are automatically analyzed using OCR and AI to generate organized travel itineraries.

The platform also provides AI-powered travel recommendations, weather information, trip history, PDF export, and secure cloud storage.

---

# ✨ Features

## 🔐 Authentication

- Email & Password Registration
- Secure Login
- Google OAuth Login
- JWT Authentication
- Forgot Password
- Change Password
- Protected Routes

---

## 👤 User Profile

- View Profile
- Edit Profile
- Google & Local Account Support


---

## 📄 Smart Document Upload

- Upload PDF Documents
- Upload Images
- Multiple File Upload
- Cloudinary File Storage
- OCR Text Extraction
- PDF Text Extraction

---

## 🤖 AI Features

- AI Itinerary Generation
- AI Travel Recommendations
- Destination Suggestions
- Local Attractions
- Restaurant Recommendations
- Transportation Suggestions
- Budget Planning
- Travel Tips

---

---

## 📅 Trip Management

- Trip History
- View Previous Trips
- Share Trips
- Generate PDFs
- Download Itineraries

---

## ☁ Cloud Features

- Cloudinary Image Storage
- MongoDB Atlas Database
- Secure File Management

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast
- React Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Passport.js
- Google OAuth 2.0
- Multer

---

## AI Services

- Groq AI
- Google Gemini AI (Fallback Support)
- OCR
- PDF Parser

---

## Cloud Services

- Cloudinary
- MongoDB Atlas

---

## Deployment

- AWS EC2
- Nginx
- PM2
- No-IP Dynamic DNS
- Let's Encrypt SSL

---

# 📂 Project Structure

```bash
tripgen-ai
│
├── client
├── TripGen-ai
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   └── server.js
│
├── README.md
└── .gitignore
```

---
# Pages

- Login Page
- Register Page
- Dashboard
- Upload Documents
- AI Generated Itinerary
- AI Travel Planner
- Profile Page
- Trip History

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Hemandh-2003/tripgen-ai.git

cd tripgen-ai
```

---

## Backend Setup

```bash
cd server

npm install
```

Create a `.env` file inside the **server** folder.

```env
PORT=8000

MONGO_URI=

JWT_SECRET=

CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=

GROQ_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client

cd TripGen-ai

npm install

npm run dev
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Google OAuth Authentication
- Secure Cloudinary URLs
- MongoDB Atlas Security

---

# 📥 PDF Export

TripGen AI allows users to download professional travel itinerary PDFs containing:

- Trip Overview
- Travel Summary
- Day-wise Activities
- AI Travel Recommendations
- Budget Plan
- Travel Tips

---

# 🌎 AI Workflow

```text
Upload Travel Documents
          │
          ▼
 PDF / OCR Extraction
          │
          ▼
      AI Processing
          │
          ▼
 AI Itinerary Generation
          │
          ▼
Travel Recommendations
          │
          ▼
Weather Information
          │
          ▼
 Download / Share Trip
```

---

# 🚀 Deployment

Production deployment uses:

- AWS EC2
- PM2 Process Manager
- Nginx Reverse Proxy
- No-IP Dynamic DNS
- HTTPS using Let's Encrypt SSL

---

# 🎯 Future Enhancements

- Email Verification
- Flight Price Tracking
- Hotel Price Tracking
- Google Maps Integration
- Calendar Sync
- AI Packing Assistant
- Multi-language Support
- Mobile Application
- Push Notifications

---

# 👨‍💻 Author

## Hemandh T S

**Full Stack MERN Developer**

GitHub:
https://github.com/Hemandh-2003

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---
Made with ❤️ using the MERN Stack & Artificial Intelligence
