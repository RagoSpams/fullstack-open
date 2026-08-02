cat << 'EOF' > src/components/BlogForm.jsx
import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mt: 2, mb: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        create new
      </Typography>
      <div>
        <TextField
          label="title"
          placeholder="write title here"
          variant="outlined"
          fullWidth
          margin="dense"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <TextField
          label="author"
          placeholder="write author here"
          variant="outlined"
          fullWidth
          margin="dense"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <TextField
          label="url"
          placeholder="write url here"
          variant="outlined"
          fullWidth
          margin="dense"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        create
      </Button>
    </Box>
  )
}

export default BlogForm
EOF