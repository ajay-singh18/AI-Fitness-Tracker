# AI Fitness Tracker

An intelligent full-stack web application designed to help you track your daily fitness activities and meals seamlessly. It integrates an AI-powered image analysis tool that estimates food nutritional information and calorie counts directly from photos.

## 🚀 Features
- **User Authentication**: Secure JWT-based registration and login system.
- **Personalized Profiles**: Tracks age, weight, height, and fitness goals (lose/maintain/gain weight) to calculate daily calorie targets.
- **Activity Logging**: Keep track of daily workouts, including duration and calories burned.
- **Food & Nutrition Logging**: Log meals (breakfast, lunch, dinner, snacks) with calorie tracking.
- **AI Image Analysis**: Snap a photo of your food, and the app uses the Google Gemini AI to instantly identify the food and estimate its caloric value.

## 🛠 Tech Stack

### Frontend 
- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend
- **Framework**: Express.js, Node.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & bcryptjs
- **AI Integration**: `@google/genai` (Gemini-2.5-Flash)

## 📦 Project Structure

The project is structured as a monorepo containing both the frontend and backend applications:

- `/frontend` - The Vite + React web application 
- `/backend` - The Express + MongoDB REST API server

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB server)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/ajay-singh18/AI-Fitness-Tracker.git
cd AI-Fitness-Tracker
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=1337
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:1337
   ```
4. Start the frontend application:
   ```bash
   npm run dev
   ```

## 🌐 Usage
1. Open your browser and navigate to `http://localhost:5174/` (or the port Vite provides).
2. Register a new account and fill out the onboarding profile details.
3. Start logging your daily meals and activities. To test the AI feature, navigate to the Food Log, click "Add New Entry", and select an image!

## 📜 License
This project is licensed under the MIT License.
