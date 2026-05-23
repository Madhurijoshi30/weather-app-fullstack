import { useState } from 'react';
import { getAIRecommendation } from '../api/weatherApi';

export default function WeatherCard({ weather }) {
  const [isCelsius, setIsCelsius] = useState(true);
  const [recommendation, setRecommendation] = useState('');
  const [loadingRec, setLoadingRec] = useState(false);

  const temp = isCelsius
    ? `${weather.temp}°C`
    : `${Math.round(weather.temp * 9/5 + 32)}°F`;

  const getRecommendation = async () => {
    setLoadingRec(true);
    setRecommendation('');
    try {
        const response = await getAIRecommendation({
            city: weather.city,
            temp: Math.round(weather.temp),
            feelsLike: Math.round(weather.feelsLike),
            humidity: weather.humidity,
            windSpeed: weather.windSpeed,
            description: weather.description
        });
        setRecommendation(response.data.recommendation);
    } catch (error) {
        console.error('Error:', error);
        setRecommendation('Could not get recommendation right now.');
    } finally {
        setLoadingRec(false);
    }
};

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

      {/* AI Recommendation */}
      <button
        className="recommend-btn"
        onClick={getRecommendation}
        disabled={loadingRec}
      >
        {loadingRec ? 'Thinking...' : '✨ What should I wear today?'}
      </button>

      {recommendation && (
        <div className="recommendation-card">
          <h4>AI Recommendation</h4>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}