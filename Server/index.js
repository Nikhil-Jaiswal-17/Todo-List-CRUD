const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/todo');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test");

// Add a single task
app.post('/add', (req, res) => {
    const { task, isDone } = req.body; 
    TodoModel.create({ task, isDone }) 
        .then(result => res.json(result)) 
        .catch(err => {
            console.error('Error saving todo:', err);
            res.status(500).json({ error: 'Failed to save todo.' });
        });
});

// Fetch all tasks
app.get('/todos', (req, res) => {
    TodoModel.find() 
        .then(todos => res.json(todos))
        .catch(err => {
            console.error('Error fetching todos:', err);
            res.status(500).json({ error: 'Failed to fetch todos.' });
        });
});

// Delete a task
app.delete('/delete/:id', (req, res) => {
    TodoModel.findByIdAndDelete(req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            console.error('Error deleting task:', err);
            res.status(500).json({ error: 'Failed to delete task.' });
        });
});

// Update a task
app.put('/update/:id', (req, res) => {
    const { isDone } = req.body;
    TodoModel.findByIdAndUpdate(req.params.id, { isDone }, { new: true })
        .then(updatedTodo => res.json(updatedTodo))
        .catch(err => {
            console.error('Error updating task:', err);
            res.status(500).json({ error: 'Failed to update task.' });
        });
});

// Mark all tasks as read (completed)
app.put('/updateAll', (req, res) => {
    const { isDone } = req.body; 
    TodoModel.updateMany({}, { isDone }) 
        .then(() => res.json({ success: true, message: 'All tasks updated successfully' }))
        .catch(err => {
            console.error('Error updating tasks:', err);
            res.status(500).json({ error: 'Failed to update tasks.' });
        });
});

// Delete all tasks
app.delete('/deleteAll', (req, res) => {
    TodoModel.deleteMany({})
        .then(() => res.json({ success: true, message: 'All tasks deleted successfully' }))
        .catch(err => {
            console.error('Error deleting tasks:', err);
            res.status(500).json({ error: 'Failed to delete tasks.' });
        });
});



app.listen(3001, () => {
    console.log('Server is Running on PORT 3001');
});
