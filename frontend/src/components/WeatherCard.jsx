import { useState } from 'react';

export default function WeatherCard({ weather }) {
  const [isCelsius, setIsCelsius] = useState(true);

  const temp = isCelsius
    ? `${weather.temp}°C`
    : `${Math.round(weather.temp * 9/5 + 32)}°F`;

  return (
    <div className="weather-card">
      <h2>{weather.city}, {weather.country}</h2>
      <img src={weather.iconUrl} alt={weather.description} />
      <p className="temp">{temp}</p>
      <p className="desc">{weather.description}</p>
      <div className="details">
        <span>💧 {weather.humidity}%</span>
        <span>💨 {weather.windSpeed} m/s</span>
        <span>🌡 Feels like {weather.feelsLike}°C</span>
      </div>
      <button
        className="unit-toggle"
        onClick={() => setIsCelsius(!isCelsius)}
      >
        Switch to {isCelsius ? '°F' : '°C'}
      </button>
    </div>
  );
}