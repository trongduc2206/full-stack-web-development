import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

// const anecdoteReducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)
//   switch(action.type) {
//     case 'VOTE':
//       return state.map((anecdote) => {
//         if (anecdote.id === action.payload.id) {
//           return {
//             ...anecdote,
//             votes: anecdote.votes + 1,
//           }
//         }
//         return anecdote
//       })
//     case 'CREATE_ANECDOTE':
//       return state.concat(asObject(action.payload))
//     default:
//       return state
//   }
// }

// export const vote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: { id }
//   }
// }

// export const createAnecdote = (anecdote) => {
//   return {
//     type: 'CREATE_ANECDOTE',
//     payload: anecdote
//   }
// }

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      return state.concat(action.payload)
    },
    updateAnecdote(state, action) {
      return state.map((anecdote) => {
        if (anecdote.id === action.payload.id) {
          return action.payload
        } else {
          return anecdote
        }
      })
    },
    // vote(state, action) {
    //   console.log(current(state))
    //   console.log(action.payload)
    //   return state.map((anecdote) => {
    //     if (anecdote.id === action.payload) {
    //       return {
    //         ...anecdote,
    //         votes: anecdote.votes + 1,
    //       }
    //     }
    //     return anecdote
    //   })   
    // },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const { updateAnecdote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const updatedAnecdote = await anecdoteService.update(newAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

// export default anecdoteReducer

export default anecdoteSlice.reducer