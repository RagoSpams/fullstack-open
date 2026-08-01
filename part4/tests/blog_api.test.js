const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token = ''

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = {
      username: 'root',
      name: 'Superuser',
      password: 'password'
    }

    await api.post('/api/users').send(user)
    const loginResult = await api.post('/api/login').send({ username: 'root', password: 'password' })
    token = loginResult.body.token

    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json and correct amount is returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  test('adding a blog fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized post',
      author: 'Unknown',
      url: 'http://example.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

after(async () => {
  await mongoose.connection.close()
})