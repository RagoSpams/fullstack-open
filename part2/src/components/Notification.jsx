const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  const notificationClass = isError ? 'notification error' : 'notification success'

  return (
    <div className={notificationClass}>
      {message}
    </div>
  )
}

export default Notification