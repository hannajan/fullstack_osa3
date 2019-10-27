require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require("./models/person")

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('post', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    numbeid: "12-43-234345",
    id: 3
  },
  {
      name: "Mary Poppendieck",
      numbeid: "39-23-6423122",
      id: 4
  }
]


  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
      });
  })

  app.get('/info', (req, res) => {
      Person.countDocuments({}, (err, count) => {
          const date = new Date()
          res.send(`<p>Phonebook has info for ${count} people<\p> <p>${date}<\p>`)
      })
  })
  
  app.get('/api/persons/:id', (req, res, next) => {
      Person.findById(req.params.id)
      .then(person => {
          if(person) {
          res.json(person.toJSON())
          } else {
              res.status(404).end()
          }
      })
      .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (req, res, next) => {
      Person.findByIdAndRemove(req.params.id)
      .then(result => {
      res.status(204).end()
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (req, res, next) => {
      const body = req.body

      if(body.name === undefined) {
          return res.status(400).json({
              error: 'name missing'
          })
      }

      if(body.number === undefined) {
          return res.status(400).json({
              error: 'number missing'
          })
      }

      if(persons.find(person => person.name === body.name)) {
          return res.status(400).json({
              error: 'name must be unique'
          })
      }

      const person = new Person({
          name: body.name,
          number: body.number,
      })

      person.save().then(savedPerson => {
          res.json(savedPerson.toJSON())
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
  })

  const unknownEndpoint = (req, res) => {
      res.status(404).send({ error: 'unknown endpoint'})
  }

  app.use(unknownEndpoint)

  const errorHandler = (error, req, res, next) => {
      console.log(error.message)

      if(error.name === 'CastError' && error.kind === 'ObjectId') {
          return res.status(400).send({ error: 'malformatted id'})
      } else if (error.name === 'ValidationError') {
          return res.status(400).json({ error: error.message })
      }

      next(error)
  }

  app.use(errorHandler)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })