const Todo = require('../model/Todo');
class TodoController {
    async doCreate(req, res) {
        const param = req.body
        try {
            const data = await (new Todo(param)).save();
            res.json({ status: 200, message: 'Todo created successfully',data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doGetAll(req, res) {
        const param = req.body
        try {
            const data = await Todo.find({ author: param.author });
            if (data == null) {
                return res.status(404).send({ message: 'Todo not found' });
            }
            res.json({ status: 200, message: `Todo get all ${param.name} data successfully`,data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doGetOne(req, res) {
        const param = req.body
        try {
            const dataTodo = await Todo.findOne({ _id: req.params.id});
            if (dataTodo == null) {
                return res.status(404).send({ message: 'Todo not found' });
            }
            const data = await Todo.findOne({ _id: req.params.id, author: param.author });
            if (data == null) {
                return res.status(401).json({ message: `You can only get your own todo.`});
            }
            res.json({ status: 200, message: `Todo get one ${param.name} data successfully`,data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doUpdate(req, res) {
        const { author, name, title, description } = req.body;
        try {
            const dataTodo = await Todo.findOne({ _id: req.params.id});
            if (dataTodo == null) {
                return res.status(404).send({ message: 'Todo not found' });
            }
            const update = await Todo.findOneAndUpdate({ _id: req.params.id, author: author} , {title, description});
            if (!update) {
                return res.status(401).send({ message: 'You can only update your own data.' });
            }
            const data = await Todo.findOne({_id: req.params.id, author: author});
            res.json({ status: 200, message: `Update todo ${name} data successfully`,data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    async doDelete(req, res) {
        const param = req.body
        try {
            const dataTodo = await Todo.findOne({ _id: req.params.id});
            if (dataTodo == null) {
                return res.status(404).send({ message: 'Todo not found' });
            }
            const data = await Todo.findOneAndRemove({ _id: req.params.id, author: param.author });
            if (!data) {
                return res.status(401).send({ message: 'You can only delete your own todo.' });
            }
            res.json({ status: 200, message: `Todo Deleted`,data });
        } catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

}
module.exports = TodoController