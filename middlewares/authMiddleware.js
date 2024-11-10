const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });
  
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);  // Log the decoded token
      const { id } = decoded; // Use 'id' from the decoded token
  
      const user = await User.findById(id); // Find user by 'id' instead of '_id'
      console.log(user);
      if (!user) {
        console.log(`User not found with id: ${id}`);
        return res.status(404).json({ message: 'User not found' });
      }
  
      req.user = id; // Attach 'id' to the request
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
  
  
};

module.exports = authMiddleware;
