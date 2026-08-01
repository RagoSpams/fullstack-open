import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  const blogFormRef = useRef()

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Logged in as ${user.name}`)
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    showNotification('Logged out successfully')
  }

  // Exercise 5.5 & 5.6: Create Blog and close Togglable form
  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      // Attach current user metadata to preserve UI state (Exercise 5.9 fix)
      const blogToSet = { ...returnedBlog, user: user }
      setBlogs(blogs.concat(blogToSet))
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (exception) {
      showNotification('Failed to add blog. Ensure title and url are included.', 'error')
    }
  }

  // Exercise 5.8 & 5.9: Like Blog
  const handleUpdateLikes = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id === id ? { ...updatedBlog, user: blog.user } : blog))
    } catch (exception) {
      showNotification('Failed to update likes', 'error')
    }
  }

  // Exercise 5.11: Delete Blog
  const handleDeleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('Blog post deleted')
    } catch (exception) {
      showNotification('Failed to delete blog post', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // Exercise 5.10: Sort blogs by number of likes descending
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout} style={{ marginLeft: 10 }}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      <br />
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={handleUpdateLikes}
          deleteBlog={handleDeleteBlog}
          currentUser={user}
        />
      )}
    </div>
  )
}

export default App