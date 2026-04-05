const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const user  = await User.create({ name, email, password });
    res.status(201).json({ token: sign(user._id), user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ token: sign(user._id), user: { name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;