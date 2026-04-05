import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance — base config set once, used everywhere
const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getWeather       = (city)       => api.get(`/weather?city=${city}`);
export const getForecast      = (city)       => api.get(`/forecast?city=${city}`);
export const getWeatherByCoords = (lat, lon) => api.get(`/weather/coords?lat=${lat}&lon=${lon}`);
export const loginUser        = (data)       => api.post('/auth/login', data);
export const registerUser     = (data)       => api.post('/auth/register', data);
export const saveFavourite    = (city)       => api.post('/favourites', { city });
export const getFavourites    = ()           => api.get('/favourites');
export const deleteFavourite  = (city)       => api.delete(`/favourites/${city}`);