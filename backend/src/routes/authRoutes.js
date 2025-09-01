const express = require('express');
const { login, me, logout } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout); // client will just discard token
router.get('/me', requireAuth, me);

module.exports = router;
