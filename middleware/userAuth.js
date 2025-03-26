const jwt = require('jsonwebtoken');
const JWT_SECRET = '1234';

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Access denied. No token provided.'});
    }

    const token = authHeader.split(' ')[1]; // Extract token

    try {
        req.user = jwt.verify(token, JWT_SECRET); // Attach user data (userId) to the request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Token expired. Please log in again.'});
        }
        res.status(400).json({message: 'Invalid token.'});
    }
}

module.exports = authenticate;
