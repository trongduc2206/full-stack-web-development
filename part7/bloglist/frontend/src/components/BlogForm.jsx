import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blog'
import { setNotification } from '../reducers/notification'

const BlogForm = () => {
  const [newBlog, setNewBLog] = useState({ title: '', author: '', url: '' })

  const onChange = (event) => {
    setNewBLog({ ...newBlog, [event.target.name]: event.target.value })
  }
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    dispatch(createBlog(newBlog))
    dispatch(setNotification({
      message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: 'success'
    }, 5))
    setNewBLog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            name='title'
            value={newBlog.title}
            onChange={onChange}
            placeholder='title of blog'
          />
        </div>
        <div>
          author:
          <input
            name='author'
            value={newBlog.author}
            onChange={onChange}
            placeholder='author of blog'
          />
        </div>
        <div>
          url:
          <input
            name='url'
            value={newBlog.url}
            onChange={onChange}
            placeholder='url of blog'
          />
        </div>
        <button type="submit">create</button>
      </form>

    </div>
  )
}

export default BlogForm