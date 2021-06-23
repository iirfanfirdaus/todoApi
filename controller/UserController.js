const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../model/User');
class UserController {
    async doCreate(req, res) {
        const param = req.body
        try {
            const user = await User.findOne({ email : param.email });
            if(user != null) {
                res.status(400).send({ message: 'A user with that email exists already' });
                return;
            }

            let hash = await bcrypt.hash(param.password, saltRounds);
            if(hash != undefined) {
                param.password = hash
                const data = await (new User(param)).save();
                res.json({ status: 200, message: 'User created successfully',data });
            } else {
                res.status(400).send({ message: 'Error during saving data' });
            }
            
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doGetAll(req, res) {
        try {
            const data = await User.find();
            res.json({ status: 200, message: `User get all data successfully`,data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doGetOne(req, res) {
        try {
            const data = await User.findOne({ _id: req.params.id });
            if (data == null) {
                return res.status(404).send({ message: 'User not found' });
            }
            if (data.id !== req.app.locals.id) {
                return res.status(401).json({ message: `You can only get your own data.`});
            }
            res.json({ status: 200, message: `User get one data successfully`,data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doUpdate(req, res) {
        const { name } = req.body;
        try {
            const dataUser = await User.findOne({ _id: req.params.id});
            if (dataUser == null) {
                return res.status(404).send({ message: 'User not found' });
            }
            if (dataUser.id !== req.app.locals.id) {
                return res.status(401).json({ message: `You can only update your own data.`});
            }
            await User.findOneAndUpdate({ _id: req.params.id} , {name});
            const data = await User.findOne({_id: req.params.id});
            res.json({ status: 200, message: `Update User ${name} data successfully`,data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doChangePassword(req, res) {
        let { oldPassword, newPassword, password } = req.body;
        try {
            const dataUser = await User.findOne({ _id: req.params.id});
            if (dataUser == null) {
                return res.status(404).send({ message: 'User not found' });
            }
            if (dataUser.id !== req.app.locals.id) {
                return res.status(401).json({ message: `You can only update your own data.`});
            }
            const match = await bcrypt.compare(oldPassword, dataUser.password);
            if(match) {
                // generate / hash new password
                let hash = await bcrypt.hash(newPassword, saltRounds);
                password = hash;
                await User.findOneAndUpdate({ _id: req.params.id}, {password});
                res.json({ status: 200, message: `Change password successfully` });
            } else {
                res.status(400).send({ message: "Incorrect old password" });
            }
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }
    
    
}
module.exports = UserController