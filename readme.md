# BookIt - Experience Booking Application

A modern, full-stack web application for browsing and booking experiences like yoga sessions, wine tours, cooking classes, and adventure activities.

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Available Promo Codes](#available-promo-codes)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Development](#development)
)

## 🎯 Overview

BookIt is a comprehensive booking platform that connects users with unique experiences. Built with React, Node.js, and MongoDB, it provides a seamless booking experience with real-time availability, promo code support, and a responsive interface.

**Live Demo:** [https://traveltakback.vercel.app](https://traveltakback.vercel.app)

## ✨ Features

### Frontend
- 🔍 **Experience Browsing** - View all available experiences with rich media and detailed descriptions
- 📅 **Real-time Availability** - See available time slots and dates
- 🎫 **Smart Booking System** - Select slots, choose quantity, and complete bookings seamlessly
- 💰 **Promo Code Integration** - Apply discount codes for special offers

### Backend
- 🚀 **RESTful API** - Clean, well-documented API endpoints
- 🗄️ **MongoDB Integration** - Flexible NoSQL database architecture
- ✅ **Input Validation** - Comprehensive server-side validation
- 🛡️ **Error Handling** - Robust error handling and logging
 

## 📁 Project Structure

```
bookit-app/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── store/          # Redux store configuration
│   │   │   ├── slices/     # Redux slices
│   │   │   └── store.ts    # Store setup
│   │   ├── types/          # TypeScript interfaces
│   │   ├── config/         # Axios and app configuration
│   │   ├── App.tsx         # Main app component
│   │   └── index.tsx       # Entry point
│   ├── package.json
│   └── .env.example
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Custom middleware
│   │   ├── scripts/        # Utility scripts
│   │   │   └── seedData.js # Database seeding
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
│
└── README.md               # This file
```

## 🚀 Installation & Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookit
   NODE_ENV=development
   ```
   
   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookit?retryWrites=true&w=majority
   ```

4. **Seed the database**
   ```bash
   node src/scripts/seedData.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   Application will run on `http://localhost:3000
## 🎯 Usage Guide

### Booking Flow

1. **Browse Experiences**
   - Visit the home page to see all available experiences
   - Browse by category, location, or price

2. **View Details**
   - Click on any experience card
   - Review description, pricing, and location
   - Check available dates and time slots

3. **Make a Booking**
   - Select your preferred date and time slot
   - Choose number of participants
   - Enter your name and email
   - Apply a promo code (optional)
   - Review booking summary
   - Confirm your booking

4. **Receive Confirmation**
   - Get a unique reference ID
   - Receive confirmation email (if configured)
   - Save reference ID for future inquiries



## 🎁 Available Promo Codes

The following promo codes are seeded by default:

| Code | Type | Value | Description |
|------|------|-------|-------------|
| `SAVE10` | Percent | 10% | Save 10% on your booking |
| `FLAT100` | Flat | $100 | Get $100 off |
| `WELCOME20` | Percent | 20% | Welcome offer - 20% off |
