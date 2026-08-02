cat << 'EOF' > src/components/Blog.jsx
import { Card, CardContent, Typography, Button, Box, Link as MuiLink } from '@mui/material'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  if (!blog) return null

  const isCreator = user && blog.user && blog.user.username === user.username

  return (
    <Card variant="outlined" sx={{ my: 2, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {blog.title} by {blog.author}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 1.5 }}>
          <MuiLink href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </MuiLink>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
          <Typography variant="body1">likes {blog.likes}</Typography>
          {user && (
            <Button variant="outlined" size="small" onClick={() => handleLike(blog)}>
              like
            </Button>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          added by {blog.user ? blog.user.name : 'unknown'}
        </Typography>

        {isCreator && (
          <Button variant="contained" color="error" size="small" onClick={() => handleDelete(blog)} sx={{ mt: 2 }}>
            remove
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog
EOF