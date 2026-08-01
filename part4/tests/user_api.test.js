const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const initialUser = {
      username: 'root',
      name: 'Superuser',
      password: 'password'
    }
    await api.post('/api/users').send(initialUser)
  })

  test('creation fails with proper status code and message if username is short', async () => {
    const newUser = {
      username: 'ro',
      name: 'Short Username',
      password: 'password123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('at least 3 characters'))
  })

  test('creation fails with proper status code and message if password is short', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('at least 3 characters'))
  })
})

after(async () => {
  await mongoose.connection.close()
})