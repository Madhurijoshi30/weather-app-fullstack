const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// Helper to generate token
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ── POST /api/auth/register ──
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate all fields exist
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Create user — password gets hashed automatically via pre save hook
    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/auth/me — get current logged in user ──
router.get('/me', require('../middleware/auth'), async (req, res) => {
  res.json({
    user: {
      id:         req.user._id,
      name:       req.user.name,
      email:      req.user.email,
      favourites: req.user.favourites,
    }
  });
});

module.exports = router;