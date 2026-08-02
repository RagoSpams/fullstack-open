cat << 'EOF' > src/components/Notification.jsx
import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification || !notification.message) {
    return null
  }

  return (
    <Alert severity={notification.type === 'error' ? 'error' : 'success'} sx={{ my: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
EOF