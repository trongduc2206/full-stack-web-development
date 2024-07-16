import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    }
  },
})

export const setNotification = (notification, timeout) => {
  return dispatch => {
    dispatch(changeNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification(notification))
    }, timeout * 1000)
  }
}

export const { changeNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer