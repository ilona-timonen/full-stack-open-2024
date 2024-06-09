const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// Luodaan mukautettu token, joka näyttää POST-pyynnön datan
morgan.token('postData', (req, res) => {
  console.log("ilona postData");
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '-';
  });
  app.use(cors());
// Käytetään Expressin JSON-muotoisten pyyntöjen käsittelyyn
app.use(express.json());

// Käytetään Morgania loggaamaan konsoliin
app.use(morgan(':method :url :status :response-time ms - :postData'));

let notes = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
    console.log("ilona app.get");
    response.json(notes)
  })

  app.get('/info', (request, response) => {
    console.log("ilona app.get")
    const currentTime = new Date();
    const info = `
        <p>Phonebook has info for ${notes.length} people</p>
        <p>${currentTime}</p>
    `;
    response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
    console.log("ilonan app.get persons id");
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).json({ error: 'Note not found' });
    }
});

app.delete('/api/persons/:id', (request, response) => {
    console.log("ilonan delete");
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log("ilona app.post"); 
    // Tarkistetaan, että pyynnön rungossa on sekä nimi että numero
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number is missing' 
        });
    }

    // Tarkistetaan, että lisättävä nimi ei ole jo luettelossa
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

app.use((request, response) => {
  console.log("ilona. use");
  response.status(404).send({ error: 'Unknown endpoint' });
});

const PORT = process.env.PORT || 3001
//const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})