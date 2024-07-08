import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ type: null, message: null })

  const getAllBlogs = async () => {
    const allBlogs = await blogService.getAll()
    // allBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(allBlogs)
  }

  const addBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    try {
      const createdBlog = await blogService.create(newBlog)
      await getAllBlogs()
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch (error) {
      if(error.response.status === 401) {
        window.localStorage.removeItem('user')
        setUser(null)
      }
      showNotification(error.response.data.error, 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        // setBlogs(blogs.filter(bl => bl.id !== blog.id))
        await getAllBlogs()
        showNotification(`Blog ${blog.title} by ${blog.author} removed`, 'success')
      } catch (error) {
        if(error.response.status === 401) {
          window.localStorage.removeItem('user')
          setUser(null)
        }
        showNotification(`Blog ${blog.title} by ${blog.author} has already been removed from server`, 'error')
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }
    }
  }

  const handleLike = async (blog) => {
    const newLike = blog.likes + 1
    const newBlog = { ...blog, likes: newLike }
    const updatedBlog = await blogService.update(blog.id, newBlog)
    await getAllBlogs()
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'user', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value)
  }

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const showNotification = (message, type) => {
    setNotification(
      {
        type: type,
        message: message
      }
    )
    setTimeout(() => {
      setNotification({ type: null, message: null })
    }, 5000)
  }

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    async function getBlogs() {
      await getAllBlogs()
    }
    getBlogs()
  }, [])

  return (
    <div>
      {user === null ?
        <div>
          <h2>log in to application</h2>
          <Notification notification={notification} />
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
            username={username}
            password={password}
          />
        </div>
        :
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          <div style={{ display: 'flex' }}>
            <span>{user.name} logged in</span>
            <button onClick={handleLogout}>logout</button>
          </div>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={removeBlog} user={user} />
          )}
        </div>
      }
    </div>
  )
}

export default App