import { useSelector } from 'react-redux'
import { useRef } from 'react'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
const Blogs = () => {
  const blogs = useSelector(state => state.blogs)
  const blogFormRef = useRef()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 5,
    borderRadius: '5px',
    backgroundColor: 'rgb(226 232 240)',
    marginBottom: 5,
    marginTop: 5,
    boxShadow: '1px 3px 1px #9E9E9E'
  }

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm  />
      </Togglable>
      {[...blogs].sort((a,b) => b.likes - a.likes).map(blog =>
        <div key={blog.id}  style={blogStyle} >
          <Link  to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      )}
    </div>
  )
}

export default Blogs