import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Blog from './Blog'

test('5.13: renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing with React Testing Library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 12,
    user: { name: 'Test User' }
  }

  render(<Blog blog={blog} />)

  // Title and author should be visible
  expect(screen.getByText(/Component testing with React Testing Library/)).toBeDefined()
  expect(screen.getByText(/Full Stack Open/)).toBeDefined()

  // URL and likes should not be in the DOM initially
  expect(screen.queryByText('https://fullstackopen.com')).toBeNull()
  expect(screen.queryByText(/likes 12/)).toBeNull()
})

test('5.14: renders url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing with React Testing Library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 12,
    user: { name: 'Test User' }
  }

  const user = userEvent.setup()
  render(<Blog blog={blog} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.getByText('https://fullstackopen.com')).toBeDefined()
  expect(screen.getByText(/likes 12/)).toBeDefined()
})

test('5.15: clicking like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing with React Testing Library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 12,
    user: { name: 'Test User' }
  }

  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  // Reveal the blog details first to access the like button
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})