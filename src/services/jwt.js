import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => { 
    const token = req.cookies?.access_token ||
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null);

    if (!token) return res.status(401).render("errors/401");

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) return res.status(403).render("errors/403");
        req.user = decode;
        next();
    });
};

export default verifyJWT;