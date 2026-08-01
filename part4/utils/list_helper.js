// Exercise 4.3: Dummy function
const dummy = (blogs) => {
  return 1
}

// Exercise 4.4: Total likes calculation
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// Exercise 4.5: Favorite blog (blog with most likes)
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const topBlog = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })

  return {
    title: topBlog.title,
    author: topBlog.author,
    likes: topBlog.likes
  }
}

// Exercise 4.6: Author with the most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = {}
  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })

  let topAuthor = ''
  let maxBlogs = 0

  for (const [author, count] of Object.entries(authorCounts)) {
    if (count > maxBlogs) {
      maxBlogs = count
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

// Exercise 4.7: Author with the most total likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = {}
  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  })

  let topAuthor = ''
  let maxLikes = 0

  for (const [author, total] of Object.entries(authorLikes)) {
    if (total > maxLikes) {
      maxLikes = total
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}