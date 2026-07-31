require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()

app.use(express.json())

// -------------------------------------------------------------
// Exercise 3.18: Info endpoint
// -------------------------------------------------------------
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const infoText = `Phonebook has info for ${count} people<br/><br/>${new Date()}`
      response.send(infoText)
    })
    .catch(error => next(error))
})

// -------------------------------------------------------------
// Exercise 3.13: Fetch all phonebook entries
// -------------------------------------------------------------
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// -------------------------------------------------------------
// Exercise 3.18: Fetch single phonebook entry
// -------------------------------------------------------------
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// -------------------------------------------------------------
// Exercise 3.15: Delete phonebook entry
// -------------------------------------------------------------
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// -------------------------------------------------------------
// Exercise 3.14: Add new entry
// -------------------------------------------------------------
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// -------------------------------------------------------------
// Exercise 3.17*: Update existing phonebook entry (PUT)
// -------------------------------------------------------------
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// -------------------------------------------------------------
// Exercise 3.16: Error handling middleware (must be last loaded)
// -------------------------------------------------------------
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})