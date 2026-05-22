import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar               from '../components/SearchBar';
import WeatherCard             from '../components/WeatherCard';
import ForecastCard            from '../components/ForecastCard';
import Loader                  from '../components/Loader';
import WeatherBackground       from '../components/WeatherBackground';
import { getWeather, getForecast, getWeatherByCoords, saveFavourite, getFavourites } from '../api/weatherApi';
import { useAuth }             from '../context/AuthContext';

function processWeather(data) {
  return {
    city:        data.name,
    country:     data.sys.country,
    temp:        Math.round(data.main.temp),
    feelsLike:   Math.round(data.main.feels_like),
    humidity:    data.main.humidity,
    windSpeed:   data.wind.speed,
    description: data.weather[0].description,
    weatherId:   data.weather[0].id,
    iconUrl:     `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
}

function processForecast(data) {
  return data.list
    .filter(item => item.dt_txt.includes('12:00:00'))
    .map(day => ({
      date: new Date(day.dt * 1000).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
      }),
      temp: Math.round(day.main.temp),
      icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
      desc: day.weather[0].description,
    }));
}

// Get background class from weather ID
function getBgClass(weatherId) {
  if (!weatherId) return 'bg-default';
  if      (weatherId === 800)             return 'bg-clear';
  else if (weatherId >= 801 && weatherId <= 802) return 'bg-partly-cloudy';
  else if (weatherId >= 803 && weatherId <= 804) return 'bg-cloud';
  else if (weatherId >= 200 && weatherId <= 232) return 'bg-thunder';
  else if (weatherId >= 300 && weatherId <= 321) return 'bg-drizzle';
  else if (weatherId >= 500 && weatherId <= 531) return 'bg-rain';
  else if (weatherId >= 600 && weatherId <= 622) return 'bg-snow';
  else if (weatherId >= 700 && weatherId <= 799) return 'bg-mist';
  return 'bg-default';
}

export default function Home() {
  const [weather,  setWeather]  = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [saveMsg,  setSaveMsg]  = useState('');
  const [favourites, setFavourites] = useState([]);

  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  async function fetchFavourites() {
  try {
    const res = await getFavourites();
    setFavourites(res.data.favourites);
  } catch (err) {
    console.log(err);
  }
}
useEffect(() => {
  if (isLoggedIn) {
    fetchFavourites();
  }
}, [isLoggedIn]);

  // Derive background class directly from weather state
  // No useEffect, no document.body — pure React
  const bgClass = getBgClass(weather?.weatherId);

  async function handleSearch(city) {
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);
    setSaveMsg('');

    try {
      const [wRes, fRes] = await Promise.all([
        getWeather(city),
        getForecast(city)
      ]);
      const processed = processWeather(wRes.data);
      console.log('weatherId:', processed.weatherId, '→ bgClass:', getBgClass(processed.weatherId));
      setWeather(processed);
      setForecast(processForecast(fRes.data));
    } catch (err) {
      setError(err.response?.data?.error || 'City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);
    setSaveMsg('');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res  = await getWeatherByCoords(coords.latitude, coords.longitude);
          const city = res.data.name;
          const [wRes, fRes] = await Promise.all([
            Promise.resolve(res),
            getForecast(city)
          ]);
          const processed = processWeather(wRes.data);
          setWeather(processed);
          setForecast(processForecast(fRes.data));
        } catch (err) {
          setError('Could not get weather for your location');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        if (err.code === 1) setError('Location access denied — please allow location in your browser');
        if (err.code === 2) setError('Location unavailable — try searching manually');
        if (err.code === 3) setError('Location request timed out — try again');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }

  async function handleSaveFavourite() {
    if (!weather) return;
    try {
      await saveFavourite(weather.city);
      setSaveMsg(`${weather.city} saved to favourites!`);
      fetchFavourites();
    } catch (err) {
      setSaveMsg(err.response?.data?.error || 'Could not save');
    }
    setTimeout(() => setSaveMsg(''), 3000);
  }
  
  function handleLogout() {
  logout();
  setFavourites([]);
  navigate('/');
}

  return (
    // bgClass goes on this div — not on document.body
    <div className={`home-wrapper ${bgClass}`}>

      <WeatherBackground weatherId={weather?.weatherId || null} />

      <div className="home">

        <nav className="navbar">
          <span className="navbar-brand">🌤 Weather App</span>
          <div className="navbar-actions">
            {isLoggedIn ? (
              <>
                <span className="navbar-user">Hi, {user?.name}</span>
                <button className="navbar-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="navbar-btn accent">Login / Sign Up</Link>
            )}
          </div>
        </nav>

        <SearchBar onSearch={handleSearch} onLocation={handleLocation} />

        {loading && <Loader />}
        {error   && <p className="error">{error}</p>}

        {weather && (
          <>
            <WeatherCard weather={weather} />

            {isLoggedIn && (
              <button className="save-btn" onClick={handleSaveFavourite}>
                ⭐ Save {weather.city} to Favourites
              </button>
            )}

            {!isLoggedIn && (
              <p className="login-nudge">
                <Link to="/login">Log in</Link> to save your favourite cities
              </p>
            )}

            {saveMsg && <p className="save-msg">{saveMsg}</p>}
          </>
        )}
        {favourites.length > 0 && (
  <div className="favourites-section">
    <h2>⭐ Favourite Cities</h2>

    {favourites.map((city, index) => (
      <p key={index}>{city}</p>
    ))}
  </div>
)}

        {forecast.length > 0 && <ForecastCard days={forecast} />}

      </div>
    </div>
  );
}