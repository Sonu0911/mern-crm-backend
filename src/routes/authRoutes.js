const express = require('express');
const router = express.Router();
const limiter = require('../middleware/rateLimiter');
const protect = require('../middleware/authMiddleware');
const auth = require('../controllers/authController');

router.post('/signup', auth.signup);
router.post('/login', limiter, auth.signin);
router.post('/refresh', auth.refresh);
router.post('/logout', protect, auth.logout);

module.exports = router;