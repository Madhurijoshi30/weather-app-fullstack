const jwt  = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorised' });
  }
  try {
    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
