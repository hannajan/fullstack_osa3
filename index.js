const express = require('express')
const app = express()

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 4
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
  
    const getInfo = () => {
        const num = persons.length
        const date = new Date()
        const info = `<p>Phonebook has info for ${num} people<\p> <p>${date}<\p>`
        return info
    }

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
      res.send(getInfo())
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })