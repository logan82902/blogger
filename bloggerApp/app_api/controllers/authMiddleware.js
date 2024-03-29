const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports = function(req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Verify the token
    if (token) {
        // Token found, verify it
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                // Token verification failed
                console.error('Error verifying token:', err);

                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                console.log('Decoded Token Payload:', decoded);

                // Token is valid, attach user object to request for further processing
                User.findById(decoded._id)
                    .then(user => {
                        req.user = user; // Attach user object to request
                        next(); // Continue to the next middleware or route handler
                    })
                    .catch(err => {
                        console.error('Error finding user by ID:', err);

                        return res.status(401).json({ message: 'Unauthorized' });
                    });
            }
        });
    } else {
        // Token not found
        console.error('No token found in request');

        return res.status(401).json({ message: 'Unauthorized' });
    }
};