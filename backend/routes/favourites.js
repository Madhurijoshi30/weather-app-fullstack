const express = require('express');
const router  = express.Router();
const protect = require('../middleware/auth');
const User    = require('../models/User');

// All routes below require login
router.use(protect);

// ── GET /api/favourites ──
router.get('/', async (req, res) => {
  try {
    res.json({ favourites: req.user.favourites });
  } catch (err) {
  console.log(err);
  res.status(500).json({ error: err.message });
}
});

// ── POST /api/favourites ──
router.post('/', async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Don't add duplicates
    if (req.user.favourites.includes(city)) {
      return res.status(400).json({ error: `${city} is already in your favourites` });
    }

    req.user.favourites.push(city);
    await req.user.save();

    res.json({ favourites: req.user.favourites });

  } catch (err) {
  console.log(err);
  res.status(500).json({ error: err.message });
}
});

// ── DELETE /api/favourites/:city ──
router.delete('/:city', async (req, res) => {
  try {
    req.user.favourites = req.user.favourites.filter(
      c => c.toLowerCase() !== req.params.city.toLowerCase()
    );
    await req.user.save();

    res.json({ favourites: req.user.favourites });

  } catch (err) {
  console.log(err);
  res.status(500).json({ error: err.message });
}
});

module.exports = router;