const jwt = require('jsonwebtoken');
const secret = "rahasia"

const verifyJwt = (req, token) => {
    try {
        var decoded = jwt.verify(token, secret);
        // set id into request
        req.app.locals.id = decoded.data
        return true
    } catch(err) {
        return false
    }
}

const createJwtToken = (id) => {
    let expires = "12h"
    return jwt.sign({
        data: id,
    }, secret, { expiresIn: expires });
}

module.exports = { verifyJwt, createJwtToken }