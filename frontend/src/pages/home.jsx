import { useState } from 'react';
import SearchBar     from '../components/SearchBar';
import WeatherCard   from '../components/WeatherCard';
import ForecastCard  from '../components/ForecastCard';
import Loader        from '../components/Loader';
import { getWeather, getForecast, getWeatherByCoords } from '../api/weatherApi';
import { useAuth }   from '../context/AuthContext';

function processWeather(data) {
  return {
    city:        data.name,
    country:     data.sys.country,
    temp:        Math.round(data.main.temp),
    feelsLike:   Math.round(data.main.feels_like),
    humidity:    data.main.humidity,
    windSpeed:   data.wind.speed,
    description: data.weather[0].description,
    iconUrl:     `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
}

function processForecast(data) {
  return data.list
    .filter(item => item.dt_txt.includes('12:00:00'))
    .map(day => ({
      date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      temp: Math.round(day.main.temp),
      icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
      desc: day.weather[0].description,
    }));
}

export default function Home() {
  const [weather,  setWeather]  = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { isLoggedIn }          = useAuth();

  async function handleSearch(city) {
    setLoading(true); setError(''); setWeather(null);
    try {
      // Both requests fire at the same time — faster!
      const [wRes, fRes] = await Promise.all([
        getWeather(city),
        getForecast(city)
      ]);
      setWeather(processWeather(wRes.data));
      setForecast(processForecast(fRes.data));
    } catch (err) {
      setError(err.response?.data?.error || 'City not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleLocation() {
    if (!navigator.geolocation) return setError('Geolocation not supported');
    setLoading(true); setError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await getWeatherByCoords(coords.latitude, coords.longitude);
          setWeather(processWeather(res.data));
          const fRes = await getForecast(res.data.name);
          setForecast(processForecast(fRes.data));
        } catch {
          setError('Could not get weather for your location');
        } finally {
          setLoading(false);
        }
      },
      () => { setError('Location access denied'); setLoading(false); }
    );
  }

  return (
    <div className="home">
      <h1>🌤 Weather App</h1>
      <SearchBar onSearch={handleSearch} onLocation={handleLocation} />
      {isLoggedIn && <p className="tip">Logged in — your searches are being saved</p>}
      {loading  && <Loader />}
      {error    && <p className="error">{error}</p>}
      {weather  && <WeatherCard weather={weather} />}
      {forecast.length > 0 && <ForecastCard days={forecast} />}
    </div>
  );
}