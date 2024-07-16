import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notification'
import blogReducer from './reducers/blog'
import userReducer from './reducers/user'
import userListReducer from './reducers/userList'
import commentReducer from './reducers/comment'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
    userList: userListReducer,
    comments: commentReducer
  }
})

export default store