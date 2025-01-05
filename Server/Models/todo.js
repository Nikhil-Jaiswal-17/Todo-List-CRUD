const mongoose = require('mongoose');

// Define the schema for individual tasks
const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        default: false
    }
});

// Create a model for individual tasks
const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;
