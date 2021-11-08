const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogOject = new Blog(blog)
    await blogOject.save()
  }

  const passwordHash = await bcrypt.hash('truc', 10)
  const userObject = new User({ username: 'test', passwordHash })
  await userObject.save()

  const login = await api
    .post('/api/login')
    .send({
      username: 'test',
      password: 'truc'
    })

  token = login.body.token
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
    .set('Authorization', `bearer ${token}`)
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

test('if "likes" is missing, default to 0', async () => {
  const newBlog = {
    title: 'Blog with 0 likes',
    author: 'Bernard Tapis',
    url: 'https://blogwithzerolikes.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const blogToCheck = blogsAtEnd[6]
  console.log('blogToCheck:', blogToCheck)

  expect(blogToCheck.likes).toBe(0)
})

test('if title and url are missing from request, respond 400 Bad Request', async () => {
  const newBlog = {
    author: 'Simone Envoiture',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'Blog to delete',
    author: 'Me',
    url: 'https://www.blogtodelete.co.uk/',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await helper.blogsInDb()

  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)
  let titles = blogsAfterPost.map(r => r.title)
  expect(titles).toContain(
    'Blog to delete'
  )

  const blogToDelete = blogsAfterPost[6]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  console.log(blogsAfterPost)

  expect(blogsAtEnd).toHaveLength(blogsAfterPost.length - 1)

  titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const update = {
    likes: 22
  }
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(update)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[0].likes).toBe(22)
})

test('adding a blog fails if a token is not provided', async () => {
  const newBlog = {
    title: 'How I Built My Blog',
    author: 'Josh W. Comeau',
    url: 'https://www.joshwcomeau.com/blog/how-i-built-my-blog/',
    likes: 13,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})
