Weather App — Full Stack MERN
A full stack weather application with JWT authentication, saved cities, and AI-powered outfit recommendations.
Live Demo: weather-app-fullstack-five.vercel.app

Tech Stack
Frontend: React, Vite, Tailwind CSS
Backend: Node.js, Express.js, MongoDB, JWT
AI: Groq API (Llama 3.3)
DevOps: Docker, Docker Compose, GitHub Actions, Vercel, Render

Features

JWT authentication with protected routes
Real-time weather by city or GPS location
Save favourite cities per user
AI recommendation — "What should I wear today?" powered by Groq LLM
Fully responsive animated UI
Dockerized with CI/CD pipeline


Run Locally with Docker
bashgit clone https://github.com/Madhurijoshi30/weather-app-fullstack.git
cd weather-app-fullstack
# Add your .env file (see .env.example)
docker-compose up --build
Frontend: http://localhost
Backend: http://localhost:5000/api

Environment Variables
Variable                 Description
MONGO_URI                MongoDB Atlas connection string
JWT_SECRETJWT            signing secret
WEATHER_API_KEY          OpenWeather API key
GROQ_API_KEY             Groq API key for AI recommendations
VITE_API_URL             Backend base URL (must end with /api)

Author: Madhuri Joshi · GitHub · LinkedIn
