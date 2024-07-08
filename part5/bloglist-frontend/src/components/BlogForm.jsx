import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBLog] = useState({ title: '', author: '', url: '' })
  const addBlog = async (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBLog({ title: '', author: '', url: '' })
  }

  const onChange = (event) => {
    setNewBLog({ ...newBlog, [event.target.name]: event.target.value })
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

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm