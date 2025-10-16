const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Silakan login terlebih dahulu' });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.level)) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
  };
};

module.exports = { auth, checkRole };
