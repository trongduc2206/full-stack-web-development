import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const detailStyle = {
    display: 'flex',
    flexDirection: 'column'
  }
  const likeStyle = {
    display: 'flex'
  }
  const [visible, setVisible] = useState(false)
  const [removable, setRemovable] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onLike = () => {
    handleLike(blog)
  }

  const onRemove = () => {
    handleRemove(blog)
  }

  useEffect(() => {
    console.log(user)
    console.log(blog.user)
    if (user && blog && blog.user && (user.username === blog.user.username)) {
      setRemovable(true)
    } else {
      console.log('not removable')
      setRemovable(false)
    }
  }, [user, blog])

  return (
    <div style={blogStyle}>
      <div className='blogDefaultInfo'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className='blogDetail'>
        <div style={detailStyle}>
          <span>{blog.url}</span>
          <div style={likeStyle}>
            likes {blog.likes}
            <button onClick={onLike}>like</button>
          </div>
          {blog.user ? blog.user.name : null}
          {
            removable &&
            <button style={{ width: 'fit-content' }} onClick={onRemove}>remove</button>
          }
        </div>
      </div>

    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default Blog