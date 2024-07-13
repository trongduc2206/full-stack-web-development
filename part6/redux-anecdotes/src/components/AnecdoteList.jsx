import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        console.log(state)
        if (state.filter === '') return state.anecdotes
        return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
    })
    const dispatch = useDispatch()

    const handleVote = (anecdote) => {
        console.log('vote', anecdote)
        dispatch(vote(anecdote));
        const notification = `you voted '${anecdote.content}'`
        // dispatch(setNotification(notification))
        // setTimeout(() => {
        //     dispatch(removeNotification(notification))
        // }, 5000)
        dispatch(setNotification(notification, 5))
    }

    return (
        <div>
            {[...anecdotes].sort((a,b) => b.votes - a.votes).map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList