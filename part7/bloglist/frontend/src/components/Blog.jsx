import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, like } from '../reducers/blog'
import { setNotification } from '../reducers/notification'
import { addComment, setComments } from '../reducers/comment'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const comments = useSelector(state => state.comments)

  const blogStyle = {
    display: 'flex',
    flexDirection: 'column'
  }

  const likeStyle = {
    display: 'flex'
  }

  const [removable, setRemovable] = useState(false)
  const [comment, setComment] = useState('')

  const onLike = () => {
    dispatch(like(blog))
  }

  const onRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
      dispatch(setNotification({
        message: `Blog ${blog.title} by ${blog.author} removed`,
        type: 'success'
      }, 5))
    }
  }

  const onComment = async (event) => {
    event.preventDefault()
    const commentObject = {
      content: comment
    }
    dispatch(addComment(blog.id, commentObject))
  }

  useEffect(() => {
    if (user && blog && blog.user && (user.username === blog.user.username)) {
      setRemovable(true)
    } else {
      console.log('not removable')
      setRemovable(false)
    }
  }, [user, blog])

  useEffect(() => {
    if(blog) {
      dispatch(setComments(blog.comments))
    }
  }, [blog])

  if(!blog) {
    return null
  }
  return (
    <div style={blogStyle}>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url} target='_blank' rel="noreferrer" >{blog.url}</a>
      <div style={likeStyle}>
        {blog.likes} likes
        <button onClick={onLike}>like</button>
      </div>
      {blog.user ? `added by ${blog.user.name}` : null}
      <h2>comments</h2>
      <form onSubmit={onComment}>
        <input
          name='comment'
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder='comment'
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.content}</li>)}
      </ul>
      {
        removable &&
           <button style={{ width: 'fit-content' }} onClick={onRemove}>remove</button>
      }
    </div>
  )
}

export default Blog