const express = require("express");

// const { login } = require("../controller/auth");
const { signup, login, logout } = require('../controller/auth-session');
const { sessionRestrictAuthenticated, sessionRestrictGuest } = require('../middleware/protect');

const router = express.Router();

// ~~~~~~~~~~~~~~~~ Session ~~~~~~~~~~~~~~~~~~~~~
// Guest-only
router.post('/signup', sessionRestrictGuest, signup);
router.post('/login', sessionRestrictGuest, login);

// Authenticated-only
router.post('/logout',sessionRestrictAuthenticated, logout);
router.get('/profile', sessionRestrictAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.session.user });
});

// router.route("/").post(login);

module.exports = router;
