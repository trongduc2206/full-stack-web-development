const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('test user apis', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username or password has less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUserWithInvalidUsername = {
          username: 'ro',
          name: 'Superuser',
          password: 'salainen',
        }
        
        const newUserWithInvalidPassword = {
            username: 'root',
            name: 'Superuser',
            password: 'sa',
        }
    
        const invalidUsernameResult = await api
          .post('/api/users')
          .send(newUserWithInvalidUsername)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        const invalidPasswordResult = await api
          .post('/api/users')
          .send(newUserWithInvalidPassword)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(invalidUsernameResult.body.error.includes('User validation failed: username: Path `username` (`ro`) is shorter than the minimum allowed length (3).'))
        assert(invalidPasswordResult.body.error.includes('User validation failed: password: Path `password` (`ro`) is shorter than the minimum allowed length (3).'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})