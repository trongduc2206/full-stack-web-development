import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const initialState = []

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const getAllUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export const { setUsers } = userListSlice.actions
export default userListSlice.reducer