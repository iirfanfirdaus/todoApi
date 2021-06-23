const { verifyJwt } = require('../helper/JwtUtil');
const User = require('../model/User');

const getToken = (bearer) => {
    return bearer.slice(7, bearer.length)
}

/* validating jwt on header or query */
const JwtFilter = async (req, res, next) => {
    let token
    if(req.headers.authorization) {
        token = getToken(req.headers.authorization)
    } else if(req.query.token) {
        token = req.query.token        
    }
    
    if(token) {
        if(verifyJwt(req, token)) {
            const { id } = req.app.locals
            const userObj = await User.findOne({ _id : id });
            if(userObj == null) {
                res.status(400).send({ message: 'User does not exist anymore' });
            } else {
                next()
            }
        } else {
            res.status(403).send({ message: 'Token is not valid' });
        }
    } else {
        res.status(500).send({ message: 'Token is missing' });
    }
}

module.exports = { JwtFilter }