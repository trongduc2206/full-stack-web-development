import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification && notification.type === 'success')
    return (
      <div className='success'>
        {notification.message}
      </div>
    )

  if (notification && notification.type === 'error')
    return (
      <div className='error'>
        {notification.message}
      </div>
    )

  return null
}

export default Notification