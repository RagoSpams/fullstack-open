import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      user: blog.user?.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateLikes(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  // Show delete button only if current user created the blog
  const isCreatedByCurrentUser = blog.user && (
    blog.user.username === currentUser.username || blog.user === currentUser.id
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={{ marginLeft: 5 }}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike} style={{ marginLeft: 5 }}>like</button>
          </div>
          <div>{blog.user?.name || currentUser.name}</div>
          {isCreatedByCurrentUser && (
            <button onClick={handleDelete} style={{ backgroundColor: 'dodgerblue', color: 'white' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog