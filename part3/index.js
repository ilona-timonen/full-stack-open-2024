const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// Create custom token to log POST request data
morgan.token('postData', (request, res) => {
  console.log("ilona postData request", request.body);
  if (request.method === 'POST') {
    console.log("ilona post inside");
    return JSON.stringify(request.body);
  }
  console.log("ilona not post but empty");
  return '-';
});

app.use(cors());
app.use(express.json());

// Use Morgan for logging
app.use(morgan(':method :url :status :response-time ms - :postData'));

let notes = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendick", number: "39-23-6423122" }
];

// Get all persons
app.get('/api/persons', (request, response) => {
  console.log("ilona app.get");
  response.json(notes);
});

// Get information
app.get('/info', (request, response) => {
  console.log("ilona app.get");
  const currentTime = new Date();
  const info = `
      <p>Phonebook has info for ${notes.length} people</p>
      <p>${currentTime}</p>
  `;
  response.send(info);
});

// Get person by ID
app.get('/api/persons/:id', (request, response) => {
  console.log("ilona app.get persons id");
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).json({ error: 'Note not found' });
  }
});

// Delete person by ID
app.delete('/api/persons/:id', (request, response) => {
  console.log("ilona delete");
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
});

// Add a new person
app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log("ilona app.post");

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    });
  }

  // Check if the name is unique
  const duplicateName = notes.find(note => note.name === body.name);
  if (duplicateName) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const note = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  };

  notes = notes.concat(note);

  response.json(note);
});

// Handle unknown endpoints
app.use((request, response) => {
  console.log("ilona.use");
  response.status(404).send({ error: 'Unknown endpoint' });
});
// Custom middleware for logging incoming requests
app.use((req, res, next) => {
  console.log("ilona custom midleware");
  console.log(`${req.method} ${req.url}`);
  next();
});

// Example routes
app.get('/api/persons', (req, res) => {
  console.log("ilona example routes");
  res.send('GET request to /api/persons');
});

app.post('/api/persons', (req, res) => {
  res.send('POST request to /api/persons');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});