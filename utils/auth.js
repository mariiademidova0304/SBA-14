const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiration = '2h';

const authMiddleware = (req, res, next) => {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body?.token || req.query.token || req.headers.authorization;

    // We split the token string into an array and return actual token
    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }

    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    // If token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
    try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
        next();
    } catch(error) {
        return res.status(401).json({error: 'Access not authorized'});
    }
}

module.exports = authMiddleware;