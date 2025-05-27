const express = require('express');
const routers = express.Router();
const auth = require('../middleware/auth');

const { register, login, me, logout } = require('../controllers/login_register');

routers.post('/register', register);
routers.post('/login', login);

routers.get('/auth/authentication', auth, me);
routers.get('/logout', auth, logout);

module.exports = routers;