import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notification'

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser(state, action) {
      return null
    }
  },
})

export const login = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'user', JSON.stringify(user)
      )
      dispatch(setUser(user))
      blogService.setToken(user.token)
    } catch(error) {
      dispatch(setNotification({
        message: 'wrong username or password',
        type: 'error'
      }, 5))
    }
  }
}

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer