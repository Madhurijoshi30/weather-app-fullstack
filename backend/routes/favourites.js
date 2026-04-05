const router  = require('express').Router();
const protect = require('../middleware/auth');
const User    = require('../models/User');

// All routes here require login
router.use(protect);

router.get('/', async (req, res) => {
  res.json({ favourites: req.user.favourites });
});

router.post('/', async (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'City required' });
  if (req.user.favourites.includes(city))
    return res.status(400).json({ error: 'Already in favourites' });
  req.user.favourites.push(city);
  await req.user.save();
  res.json({ favourites: req.user.favourites });
});

router.delete('/:city', async (req, res) => {
  req.user.favourites = req.user.favourites.filter(c => c !== req.params.city);
  await req.user.save();
  res.json({ favourites: req.user.favourites });
});

module.exports = router;