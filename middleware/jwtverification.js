const jwt  = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send("token not found");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userdetail) => {
        if (err) return err;

        // req.body.userId = userdetai.email;
    
        // res.send("jwt verified")
        next();
    });
}

module.exports = {
    authenticateToken
}