const express = require('express')
const app = express()

// Middleware to parse JSON bodies in POST requests
app.use(express.json())

// Initial hardcoded data
let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

// Exercise 3.1: GET all entries
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Exercise 3.2: GET info page
app.get('/info', (request, response) => {
  const count = persons.length
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

// Exercise 3.3: GET single entry by ID
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Exercise 3.4: DELETE entry by ID
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

// Exercise 3.5 & 3.6: POST new entry with validation and random ID
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Exercise 3.6: Validation rules
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const nameExists = persons.some(
    p => p.name.toLowerCase() === body.name.trim().toLowerCase()
  )
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  // Exercise 3.5: Generate random ID
  const randomId = String(Math.floor(Math.random() * 1000000))

  const newPerson = {
    id: randomId,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})