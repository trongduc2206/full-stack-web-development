import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }

  if (notification.type === 'success')
    return (
      <div className='success'>
        {notification.message}
      </div>
    )

  if (notification.type === 'error')
    return (
      <div className='error'>
        {notification.message}
      </div>
    )
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired
}

export default Notification