require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.react_auth_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error) {
        return res.status(401).json({ message: 'Unauthorized: invalid token' });
    }
}