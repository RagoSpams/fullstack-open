import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
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
      navigate('/')
    } catch (exception) {
      console.error('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const padding = { padding: 5 }

  return (
    <div>
      <nav style={{ background: '#f0f0f0', padding: 10, marginBottom: 10 }}>
        <Link style={padding} to="/">blogs</Link>
        {user ? (
          <span>
            <em>{user.name} logged in</em>
            <button onClick={handleLogout} style={{ marginLeft: 5 }}>logout</button>
          </span>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </nav>

      <h2>blog app</h2>

      <Routes>
        <Route path="/" element={
          <div>
            <h3>blogs</h3>
            {blogs.map(blog => (
              <div key={blog.id} style={{ border: '1px solid black', margin: 5, padding: 5 }}>
                {blog.title} {blog.author}
              </div>
            ))}
          </div>
        } />
        <Route path="/login" element={
          <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
              <div>
                username
                <input
                  type="text"
                  value={username}
                  name="Username"
                  aria-label="username"
                  onChange={({ target }) => setUsername(target.value)}
                />
              </div>
              <div>
                password
                <input
                  type="password"
                  value={password}
                  name="Password"
                  aria-label="password"
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
              <button type="submit">login</button>
            </form>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App