# 🌾 Digital Farmer Support & Advisory System

A full-stack MERN-based agricultural support and advisory platform designed to connect farmers with agricultural experts and provide useful farming information through crop advisory, disease advisory, weather information, market prices, government schemes, consultations, real-time chat, and farm management features.

---

## 📌 Project Overview

The **Digital Farmer Support & Advisory System** is a web-based platform developed to provide farmers with centralized access to agricultural information and expert support.

The system helps farmers make better farming decisions by providing crop-related guidance, disease advisory, weather information, market prices, government scheme information, expert consultations, and communication features.

The platform provides separate functionality for farmers, agricultural experts, and administrators.

---

## 🎯 Objectives

- Provide farmers with easy access to agricultural information.
- Provide crop-specific advisory information.
- Help farmers identify and understand common crop diseases.
- Provide weather information for farming decisions.
- Display agricultural market price information.
- Provide information about government agricultural schemes.
- Connect farmers with agricultural experts.
- Support expert consultations.
- Provide real-time communication through chat.
- Manage farmer profiles and farm information.
- Provide a centralized digital agricultural support platform.

---

## ✨ Key Features

###  Farmer Features

- **Authentication & Security**: Registration, login, and JWT-based session management.
- **Profile Management**: Update farmer details, contact info, and location.
- **Farm Management**: Add, update, and manage farm locations, soil types, and farm sizes.
- **Crop Management**: Register crops planted, track sowing dates, and manage crop records.
- **Crop Advisory**: Tailored recommendations for optimal crop yield and seasonal practices.
- **Disease Advisory**: Searchable disease database with symptoms, prevention, and treatment.
- **Fertilizer Advisory**: Customized fertilizer application rates and schedules.
- **Weather Information**: Real-time local weather updates and forecasts for farm planning.
- **Market Price Information**: Live agricultural commodity market prices and trend tracking.
- **Government Schemes**: Browse active agricultural subsidy programs, eligibility, and application details.
- **Ask Questions**: Submit agricultural queries with image attachments for expert review.
- **Expert Consultations**: Request one-on-one appointments with verified agricultural specialists.
- **Real-Time Chat**: Instant messaging powered by WebSockets (`socket.io`).
- **Notifications**: System alerts for consultation responses, new advisories, and weather warnings.
- **Farmer Dashboard**: Unified control panel summarizing farms, crops, weather, and advisory feeds.

### 👨‍🔬 Agricultural Expert Features

- **Expert Authentication & Profile**: Specialized account management with area of expertise, qualification, and credentials.
- **Farmer Question Desk**: View pending questions from farmers and provide detailed solutions.
- **Consultation Workspace**: Accept, schedule, manage, and complete farmer consultation requests.
- **Direct Communication**: Engage in real-time interactive chat with assigned farmers.
- **Expert Dashboard**: Track total consultations, answered queries, and active messaging sessions.

### 🛡️ Admin Features

- **User Management**: Overview and role assignment for Farmers, Experts, and System Admins.
- **Farmer & Expert Verification**: Validate expert credentials and oversee registered farm profiles.
- **Advisory Management**: Create, update, and publish Crop, Disease, and Fertilizer advisories.
- **Government Scheme Management**: Post new schemes, guidelines, and application links.
- **Market Price Updates**: Manage and broadcast commodity price records.
- **Content & Moderation**: Monitor user questions, consultations, and report logs.
- **System Dashboard**: Analytics overview of platform engagement, user counts, and active advisory metrics.

---

## 🌱 Agricultural Advisory Modules

###  Crop Advisory
Provides useful crop-related information and recommendations to help farmers understand crop requirements, ideal soil types, temperature ranges, and optimal farming practices.

###  Disease Advisory
Provides comprehensive information about common crop diseases, early visual symptoms, biological and chemical prevention methods, and recommended management practices.

###  Fertilizer Advisory
Provides fertilizer-related guidance based on crop type, growth stages, NPK nutrient requirements, and soil health conditions.

###  Weather Advisory
Provides weather information and forecasts that can help farmers plan critical agricultural activities like irrigation, sowing, harvesting, and spraying.

###  Market Advisory
Provides agricultural market price information (APMC mandi prices) to help farmers understand current market conditions, demand, and fair price realization.

###  Government Schemes
Provides structured information about national and state-level agricultural government schemes, financial subsidies, crop insurance, and eligibility requirements.

---

## 💬 Communication Features

The system provides multi-channel communication between farmers and agricultural experts through:

- **Questions & Answers**: Structured forum format with photo uploads and expert answers.
- **Expert Consultations**: Formal request-driven consultation scheduling.
- **Real-Time Chat**: WebSockets (`Socket.IO`) powered instant messaging for active consultations.
- **Notifications**: Automated alert system for real-time status updates and messages.

---

##  Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Real-Time WebSockets**: `socket.io-client`

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose ORM](https://mongoosejs.com/)
- **Real-Time WebSockets**: `socket.io`
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` password hashing
- **File Uploads**: `multer` + [Cloudinary](https://cloudinary.com/) storage
- **Security**: `helmet` + `express-rate-limit` + `cors`

---

##  System Architecture

```text
                    ┌─────────────────────┐
                    │      Farmer         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       (Vite)        │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP / WebSockets
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
          ┌────────────┐ ┌───────────┐ ┌─────────────┐
          │  MongoDB   │ │ Cloudinary│ │ External APIs│
          │  Database  │ │   Media   │ │Weather/Other│
          └────────────┘ └───────────┘ └─────────────┘

                    ┌─────────────────────┐
                    │ Agricultural Expert │
                    └──────────┬──────────┘
                               │
                               ▼
                         Expert Services

                    ┌─────────────────────┐
                    │      Admin          │
                    └──────────┬──────────┘
```

---

##  Repository Structure

```text
Digital Farmer Support & Advisory System/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and Cloudinary configuration
│   │   ├── controllers/    # API Request Handlers
│   │   ├── middlewares/    # Auth verification, file uploads, error handling
│   │   ├── models/         # Mongoose Schemas (User, Farm, Crop, Advisory, etc.)
│   │   ├── routes/         # Express API Route Definitions
│   │   ├── utils/          # Database seed scripts and Socket.IO initialization
│   │   └── server.js       # Main server application entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI Components (Navbar, Footer, ProtectedRoute)
│   │   ├── context/        # React Context (AuthContext, SocketContext)
│   │   ├── pages/          # Application Views (Dashboard, Advisory, Chat, Market, etc.)
│   │   ├── services/       # Axios API Client Configuration
│   │   ├── App.jsx         # Main React Router Component
│   │   └── main.jsx        # Frontend Entry Point
│   ├── .env.example        # Frontend environment variable template
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following software installed locally:
- [Node.js](https://nodejs.org/) (`v18+` recommended)
- [npm](https://www.npmjs.com/) (`v9+` recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

---

###  Local Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shivakumarshivayogi/Digital-Farmer-Support-Advisory-System.git
   cd "Digital Farmer Support & Advisory System"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder based on `.env.example`:
     ```env
     PORT=5000
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/digital_farmer_db
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=30d
     WEATHER_API_KEY=your_weather_api_key
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     CLIENT_URL=http://localhost:5173
     ```
   - Start the backend dev server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` folder based on `.env.example`:
     ```env
     VITE_BACKEND_URL=http://localhost:5000
     ```
   - Start the frontend dev server:
     ```bash
     npm run dev
     ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

##  Security & Best Practices

- **Protected Environment Variables**: Credentials, API keys, and database connection strings are stored securely in `.env` files and excluded from Git via `.gitignore`.
- **JWT Authentication**: Passwords hashed with `bcryptjs`, requests authenticated via HTTP headers.
- **Input & Rate Protection**: Express rate limiting and Helmet headers implemented to mitigate standard web vulnerabilities.

---

##  License

This project is open-source and available under the **ISC License**.

---

##  Author

**Shivakumar Shivayogi**
- GitHub: [@shivakumarshivayogi](https://github.com/shivakumarshivayogi)
