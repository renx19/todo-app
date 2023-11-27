const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
const corsOptions = {
  origin: 'https://todo-app-frontend-beryl.vercel.app',
  methods: 'POST,GET,PUT,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));


// Connect to MongoDB
mongoose.connect('mongodb+srv://SHIRO:Lordwalker_12@cluster0.tavlp2j.mongodb.net/tassk?retryWrites=true&w=majority');




const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Todo schema and model
const todoSchema = new mongoose.Schema({
  input: String,
  text: String,
  isComplete: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
// Get all todos
app.get('/', async (req, res) => {  
    res.json("hello");

});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add todo
app.post('/add', async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update todo
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete todo
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Complete todo
app.put('/complete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    todo.isComplete = !todo.isComplete;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
