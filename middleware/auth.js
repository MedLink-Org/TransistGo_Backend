import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).send({message: 'No token provided'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({message: 'Invalid or Expired Token'});
        req.user = decoded;
        next();
    })
}

export default  verifyToken;