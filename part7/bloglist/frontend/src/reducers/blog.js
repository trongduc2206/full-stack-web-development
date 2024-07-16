import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { clearUser } from './user'
import { setNotification } from './notification'


const initialState = []

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    appendBlog(state, action) {
      return state.concat(action.payload)
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload.id)
    },
    updateBlog(state, action) {
      return state.map((blog) => {
        if (blog.id === action.payload.id) {
          return action.payload
        } else {
          return blog
        }
      })
    },
    setBlog(state, action) {
      return action.payload
    }
  },
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(appendBlog(newBlog))
    } catch (error) {
      console.log(error)
      if(error.response.status === 401) {
        window.localStorage.removeItem('user')
        dispatch(clearUser())
      }
      dispatch(setNotification({
        message: error.response.data.error,
        type: 'error'
      }, 5))
    }
  }
}

export const like = (blog) => {
  return async dispatch => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    await blogService.update(blog.id, newBlog)
    dispatch(updateBlog(newBlog))
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    try {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog))
    } catch(error) {
      if(error.response.status === 401) {
        window.localStorage.removeItem('user')
      }
      dispatch(setNotification({
        message: `Blog ${blog.title} by ${blog.author} has already been removed from server`,
        type: 'error'
      }, 5))
    }
  }
}

export const { appendBlog, updateBlog, setBlog, removeBlog } = blogSlice.actions
export default blogSlice.reducer