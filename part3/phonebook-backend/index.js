const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req, res) { if(Object.keys(req.body).length !== 0) {return JSON.stringify(req.body)} else { return " "} })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')

app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numberOfPerson = persons.length;
    const word = numberOfPerson > 1 ? 'people' : 'person'
    const date = new Date();
    response.send(`<p>Phonebook has info for ${numberOfPerson} ${word}</p>
        <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    personToDelete = persons.find(person => person.id === id)
    persons = persons.filter(person => person.id !== id)
  
  
    response.json(personToDelete);
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    // console.log(body)
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    const checkPerson = persons.find(person => person.name === body.name);
    if(checkPerson) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})