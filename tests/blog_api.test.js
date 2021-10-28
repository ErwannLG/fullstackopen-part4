const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogOject = new Blog(blog)
    await blogOject.save()
  }
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of blog post is named "id"', async () => {
  const response = await api.get('/api/blogs')

  const id = response.body[0].id
  expect(id).toBeDefined()
})

test('a new blog post can be created', async () => {
  const newBlog = {
    title: 'How I Built My Blog',
    author: 'Josh W. Comeau',
    url: 'https://www.joshwcomeau.com/blog/how-i-built-my-blog/',
    likes: 13,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).toContain(
    'How I Built My Blog'
  )
})

afterAll(() => {
  mongoose.connection.close()
})
