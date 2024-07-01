const { test, after, beforeEach, before, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let firstUserToken = ''
let secondUserToken = ''
const password='123456'

describe('test blog apis', () => {
    before(async () => {
      await User.deleteMany({})

      const firstTestUser = {
        username: "test1",
        name: "test1",
        password
      }
      await api.post('/api/users')
        .send(firstTestUser)
      console.log('created first test user')
      
      const secondTestUser = {
        username: "test2",
        name: "test2",
        password
      }
      await api.post('/api/users')
      .send(secondTestUser)
      console.log('created second test user')


      const firstUserLogin = await api.post('/api/login')
            .send({username: firstTestUser.username, password})
      firstUserToken = `Bearer ${firstUserLogin.body.token}`
      console.log('token of first user', firstUserToken)

      const secondUserLogin = await api.post('/api/login')
            .send({username: secondTestUser.username, password})
      secondUserToken = `Bearer ${secondUserLogin.body.token}`
      console.log('token of second user', secondUserToken)
    })

    beforeEach(async () => {
      await Blog.deleteMany({})

      for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
      }

    })

    describe('tests for getting blogs api', () => {
      test('there are two blogs returned in JSON format', async () => {
        const response = await api.get('/api/blogs')
        assert.match(response.headers['content-type'],/application\/json/ )
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

      test('the unique identifier property of the blog posts is named id', async () => {
          const response = await api.get('/api/blogs')
          response.body.forEach(blog => {
              assert.ok(blog.hasOwnProperty('id'));
          });
      })
    })


    describe('addition of a new blog', () => {
      test('succeeds with valid data and valid token', async () => {
        const newBlog = {
            title: 'Service design',
            author: 'Jussi Voipio',
            url: 'http://anx.tech.com/service-design',
            likes: 8
        }
      
        await api
          .post('/api/blogs')
          .set('Authorization', firstUserToken)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb();
      
        const titles = blogsAtEnd.map(r => r.title)
      
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      
        assert(titles.includes('Service design'))
      })
  
      test('fails with status code 401 if token invalid', async () => {
        const newBlog = {
            title: 'Service design',
            author: 'Jussi Voipio',
            url: 'http://anx.tech.com/service-design',
            likes: 8
        }

        const randomString = "Invalid token"
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        await api
          .post('/api/blogs')
          .set('Authorization', randomString)
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb();
      
        const titles = blogsAtEnd.map(r => r.title)
      
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      
        assert(!titles.includes('Service design'))
      })
  
      test('succeeds if the `like` property is missed and that property is assigned by 0', async () => {
        const newBlog = {
          title: 'Service design',
          author: 'Jussi Voipio',
          url: 'http://anx.tech.com/service-design',
        }
      
        const savedBlog = await api
          .post('/api/blogs')
          .set('Authorization', firstUserToken)
          .send(newBlog)
        
        assert.equal(savedBlog.body.likes, 0);
      })
  
      test('fails with status 400 if title or url is missed', async () => {
        for (let blog of helper.blogsWithEmptyTitleOrUrl) {
          await api
          .post('/api/blogs')
          .set('Authorization', firstUserToken)
          .send(blog)
          .expect(400)
        }
        
        for (let blog of helper.blogsWithoutTitleOrUrl) {
          await api
          .post('/api/blogs')
          .set('Authorization', firstUserToken)
          .send(blog)
          .expect(400)
        }

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
    })
    
    describe('tests for delete blog api', () => {
      test('a blog can be deleted by its creator', async () => {
        const newBlog = {
          title: 'Born to be deleted',
          author: 'Jussi Voipio',
          url: 'http://anx.tech.com/service-design',
          likes: 8
        }
  
        const addedBlog = await api
          .post('/api/blogs')
          .set('Authorization', firstUserToken)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        await api
          .delete(`/api/blogs/${addedBlog.body.id}`)
          .set('Authorization', firstUserToken)
          .expect(204)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(newBlog.title))
      
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })

      test('a blog can not be deleted by user that is not its creator', async () => {
        const newBlog = {
          title: 'Born to be deleted',
          author: 'Jussi Voipio',
          url: 'http://anx.tech.com/service-design',
          likes: 8
        }
  
        const addedBlog = await api
          .post('/api/blogs')
          .set('Authorization', firstUserToken)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        await api
          .delete(`/api/blogs/${addedBlog.body.id}`)
          .set('Authorization', secondUserToken)
          .expect(401)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        const titles = blogsAtEnd.map(r => r.title)
        assert(titles.includes(newBlog.title))
      
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      })
    })
    
    describe('tests for updating blogs', () => {
      test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newLike = blogToUpdate.likes + 1 
      
        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send({
            ...blogToUpdate,
            likes: newLike
        })
      
        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      
        assert.strictEqual(updatedBlog.likes, newLike);
      })

      test('a blog can not be updated empty title or url', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newLike = blogToUpdate.likes + 1

        for (let blog of helper.blogsWithEmptyTitleOrUrl) {
          await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send({...blog, like: newLike}).expect(400);
        }

        const blogsAtEnd = await helper.blogsInDb()
        assert.deepStrictEqual(blogsAtStart[0], blogsAtEnd[0]);
      })

      test('a blog is updated without likes will have 0 like by default', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newBlogToUpdate = {
          title: blogToUpdate.title,
          author: blogToUpdate.author,
          url: blogToUpdate.url
        }

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(newBlogToUpdate).expect(200);

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
        assert.strictEqual(updatedBlog.likes, 0);
      })
    })
    

    after(async () => {
        await mongoose.connection.close()
    })

})
