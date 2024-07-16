import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setComments(state, action) {
      return action.payload
    },
    appendComment(state, action) {
      return [...state, action.payload]
    },
    removeComment(state, action) {
      return []
    }
  },
})

export const addComment = (blogId, comment) => {
  return async dispatch => {
    const addedComment = await blogService.comment(blogId, comment)
    console.log(addedComment)
    dispatch(appendComment(addedComment))
  }
}

export const { setComments, appendComment, removeComment } = commentSlice.actions
export default commentSlice.reducer