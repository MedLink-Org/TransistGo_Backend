import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Invalid or Expired Token' });
        req.user = decoded; // { id, role, email }
        next();
    });
}

export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied: requires role ${allowedRoles.join(' or ')}` });
        }
        next();
    };
}

export default verifyToken;