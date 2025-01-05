const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/todo');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test");

// POST route to add a single task
app.post('/add', (req, res) => {
    const { task, isDone } = req.body; // Accept task and isDone properties
    TodoModel.create({ task, isDone }) // Save as an individual document
        .then(result => res.json(result)) // Return the saved document
        .catch(err => {
            console.error('Error saving todo:', err);
            res.status(500).json({ error: 'Failed to save todo.' });
        });
});

// GET route to fetch all tasks
app.get('/todos', (req, res) => {
    TodoModel.find() // Fetch all tasks from the database
        .then(todos => res.json(todos)) // Return the tasks
        .catch(err => {
            console.error('Error fetching todos:', err);
            res.status(500).json({ error: 'Failed to fetch todos.' });
        });
});

// DELETE route to delete a task
app.delete('/delete/:id', (req, res) => {
    TodoModel.findByIdAndDelete(req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            console.error('Error deleting task:', err);
            res.status(500).json({ error: 'Failed to delete task.' });
        });
});

// PUT route to update a task
app.put('/update/:id', (req, res) => {
    const { isDone } = req.body;
    TodoModel.findByIdAndUpdate(req.params.id, { isDone }, { new: true })
        .then(updatedTodo => res.json(updatedTodo))
        .catch(err => {
            console.error('Error updating task:', err);
            res.status(500).json({ error: 'Failed to update task.' });
        });
});

// PUT route to mark all tasks as read (completed)
app.put('/updateAll', (req, res) => {
    const { isDone } = req.body; // Receive the isDone status from the frontend
    TodoModel.updateMany({}, { isDone }) // Update all tasks in the collection
        .then(() => res.json({ success: true, message: 'All tasks updated successfully' }))
        .catch(err => {
            console.error('Error updating tasks:', err);
            res.status(500).json({ error: 'Failed to update tasks.' });
        });
});

// DELETE route to delete all tasks
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
