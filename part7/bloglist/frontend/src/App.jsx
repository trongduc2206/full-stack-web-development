import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blog'
import { clearUser, setUser } from './reducers/user'
import {
  Routes, Route, useMatch
} from 'react-router-dom'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import { getAllUsers } from './reducers/userList'
import Menu from './components/Menu'

const App = () => {
  const dispatch = useDispatch()
  const userMatch = useMatch('/users/:id')
  const user = useSelector(state => state.user)
  const userSpecific = useSelector((state) => {
    return userMatch ? state.userList.find(a => a.id === userMatch.params.id) : null
  })

  const blogMatch = useMatch('/blogs/:id')
  const blogSpecific = useSelector((state) => {
    return blogMatch ? state.blogs.find(a => a.id === blogMatch.params.id) : null
  })

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    dispatch(clearUser())
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
    dispatch(initializeBlogs())
    dispatch(getAllUsers())
  }, [])

  return (
    <div>
      {user === null ?
        <div>
          <h2>log in to application</h2>
          <Notification />
          <LoginForm />
        </div>
        :
        <div>
          <div style={{ display: 'flex', backgroundColor: 'lightgray', padding: '3px' }}>
            <Menu />
            <span>{user.name} logged in</span>
            <button onClick={handleLogout}>logout</button>
          </div>
          <h2>blog app</h2>
          <Notification />
          <Routes>
            <Route path='/blogs/:id' element={<Blog blog={blogSpecific} user={user}/>} />
            <Route path='/users/:id' element={<User user={userSpecific} />} />
            <Route path='/users' element={<Users />} />
            <Route path='/' element={<Blogs />} />
          </Routes>
        </div>
      }
    </div>
  )
}

export default App