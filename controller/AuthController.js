const User = require('../model/User');
const bcrypt = require('bcrypt');
const { createJwtToken } = require('../helper/JwtUtil');
class AuthController {
    async login(req, res) {
        const param = req.body
        try {
            const user = await User.findOne({ email : param.email });
            if(user == null) {
                res.status(400).send({ message: 'A user with that email not found' });
            } else {
                // compare password                
                const match = await bcrypt.compare(param.password, user.password)
                if(match) {
                    const data = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        token: createJwtToken(user.id)
                    }
                    res.json({ status: 200, message: 'Login success', data});

                } else {
                    res.status(400).send({ message: 'Password not match' });
                }
            }
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async getUserId(req, res, next) {
        try {
            const data = await User.find({ _id: req.app.locals.id });
            req.body.author = data[0].id;
            req.body.name = data[0].name;
            next();
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

}
module.exports = AuthController