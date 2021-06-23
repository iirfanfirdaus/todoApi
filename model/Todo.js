const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const { Schema } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: 'Data must have an title'
  },
  description: {
    type: String,
    required: 'Data must have an description'
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: 'Data must have an startDate'
  },
  dueDate: {
    type: Date,
    required: 'Data must have an dueDate'
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: 'Data must have an author',
  },
});

module.exports = mongoose.model('Todo', todoSchema);
