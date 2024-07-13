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
            if(state && state === action.payload) {
                return null
            }
            return state
        }
    },
})

export const setNotification = (content, timeout) => {
    return dispatch => {
        dispatch(changeNotification(content))
        setTimeout(() => {
            dispatch(removeNotification(content))
        }, timeout * 1000)
    }
}

export const { changeNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer