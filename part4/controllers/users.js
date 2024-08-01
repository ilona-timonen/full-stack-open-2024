const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

// Lisää uusi käyttäjä
usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!name || !username || !password) {
      return response.status(400).json({ error: 'name, username and password are required' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.code === 11000) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    next(error)
  }
})

// Hae kaikki käyttäjät ja heidän bloginsa
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch users' })
  }
})

module.exports = usersRouter