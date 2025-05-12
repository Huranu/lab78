const jwt = require("jsonwebtoken");
const MyError = require("../utils/myError");

exports.jwtRestrictAuthenticated = (req, res, next) => {
  console.log(req.headers)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Access denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'SECRET123');
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Access denied: Invalid or expired token' });
  }
};

exports.jwtRestrictGuest = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET || 'SECRET123');
      return res.status(403).json({ error: 'Access denied: Not available to authenticated users' });
    } catch (error) {
      // Invalid token, treat as guest
      next();
    }
  } else {
    next();
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError("Tanii erh hurehgui baina.." + req.userRole, 403);
    }
    next();
  };
};

exports.sessionRestrictAuthenticated = (req, res, next) => {
  if (!req.session) {
    return res.status(403).json({ error: 'Access denied: Authentication required' });
  }
  next();
};

exports.sessionRestrictGuest = (req, res, next) => {
  if (req.session) {
    return res.status(403).json({ error: 'Access denied: Not available to authenticated users' });
  }
  next();
};