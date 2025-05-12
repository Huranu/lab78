const express = require('express');
const router = express.Router();
const { signup, login, refreshToken, logout } = require('../controller/auth-jwt');
const { jwtRestrictAuthenticated, jwtRestrictGuest } = require('../middleware/protect');

router.post('/signup', jwtRestrictGuest, signup);
router.post('/login', jwtRestrictGuest, login);

router.post('/refresh-token', jwtRestrictAuthenticated, refreshToken);
router.post('/logout', jwtRestrictAuthenticated, logout);
router.get('/profile', jwtRestrictAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.user.id });
});

module.exports = router;