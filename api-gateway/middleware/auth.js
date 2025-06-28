const jwt = require('jsonwebtoken');

function verifyTokenIfNeeded(req, res, next) {
  // Metodat që janë publike (nuk kërkojnë token)
  const openMethods = ['GET', 'OPTIONS', 'HEAD'];

  if (openMethods.includes(req.method)) {
    // Përmet kërkesat GET, OPTIONS, HEAD vazhdo pa verifikim token
    return next();
  }

  // Merr token nga header Authorization (formati: Bearer <token>)
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  // Verifikon token me secret nga .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

    // Ruaj informacionin e përdoruesit në req.user për përdorim më vonë
    req.user = decoded;
    next();
  });
}

module.exports = verifyTokenIfNeeded;
