const jwt = require('jsonwebtoken');

// exports.authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(403).json({ error: 'Forbidden: Invalid token' });
//   }
// };

// // Generate token for testing
// exports.generateToken = (req, res) => {
//   const token = jwt.sign({ user: 'testUser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token });
// };

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user data
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  };
  
  // Generate Token for User Authentication
  exports.generateToken = async (req, res) => {
    const { username, password } = req.body;
  
    if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  };
