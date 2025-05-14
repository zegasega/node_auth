const express = require('express');
const router = express.Router();

const { register, login, resetPassword, createNewPassword, getAllUsers, verifyAccount } = require('../controllers/user');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

router.post('/auth/register', register);

router.post('/auth/login', login);

router.post("/auth/verify-account", verifyAccount)

router.post("/auth/reset-password", resetPassword);

router.post("/auth/new-password", createNewPassword);

router.get('/users', authMiddleware, roleMiddleware(['admin']), getAllUsers);

module.exports = router;
