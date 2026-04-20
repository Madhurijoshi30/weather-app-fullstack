const express = require('express');
const router  = express.Router();

// ── Simple cache ──
const cache          = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  if (!cache.has(key)) return null;
  const { data, timestamp } = cache.get(key);
  if (Date.now() - timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ── GET /api/weather?city=Mumbai ──
router.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  const cacheKey = `weather_${city.toLowerCase()}`;
  const cached   = getCached(cacheKey);

  if (cached) {
    console.log(`Cache hit: ${city}`);
    return res.json(cached);
  }

  try {
    const apiKey   = process.env.WEATHER_API_KEY;
    const url      = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    setCache(cacheKey, data);
    res.json(data);

  } catch (err) {
    console.error('Weather fetch error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/forecast?city=Mumbai ──
router.get('/forecast', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  const cacheKey = `forecast_${city.toLowerCase()}`;
  const cached   = getCached(cacheKey);

  if (cached) {
    console.log(`Cache hit forecast: ${city}`);
    return res.json(cached);
  }

  try {
    const apiKey   = process.env.WEATHER_API_KEY;
    const url      = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    setCache(cacheKey, data);
    res.json(data);

  } catch (err) {
    console.error('Forecast fetch error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/weather/coords?lat=19.07&lon=72.87 ──
router.get('/weather/coords', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const cacheKey = `coords_${lat}_${lon}`;
  const cached   = getCached(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const apiKey   = process.env.WEATHER_API_KEY;
    const url      = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    setCache(cacheKey, data);
    res.json(data);

  } catch (err) {
    console.error('Coords fetch error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/ping — test route ──
router.get('/ping', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

module.exports = router;