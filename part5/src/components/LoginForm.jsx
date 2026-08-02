cat << 'EOF' > src/components/LoginForm.jsx
import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 400, mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Log in to application
      </Typography>
      <div>
        <TextField
          label="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          label="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        login
      </Button>
    </Box>
  )
}

export default LoginForm
EOF