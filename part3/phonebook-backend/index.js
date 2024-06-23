require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req) { if(Object.keys(req.body).length !== 0) {return JSON.stringify(req.body)} else { return ' '} })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const cors = require('cors')

app.use(cors())

const Person = require('./models/person')

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  // response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const numberOfPerson = persons.length
    const word = numberOfPerson > 1 ? 'people' : 'person'
    const date = new Date()
    response.send(`<p>Phonebook has info for ${numberOfPerson} ${word}</p>
        <p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      if(result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }

    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // console.log(body)

  Person.find({}).then(persons => {
    const checkPerson = persons.find(person => person.name === body.name)
    if(checkPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
        .catch(error => next(error))
    }
  })
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if(updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).json({ error: `Information of ${name} has already been removed from server` })
      }
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

