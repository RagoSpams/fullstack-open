cat << 'EOF' > tests/blog_app.spec.js
const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    
    await request.post('/api/users', {
      data: {
        name: 'Super User',
        username: 'root',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  // 5.17
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  // 5.18
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
      await expect(page.getByText('Super User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrongpassword')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Super User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
    })

    // 5.19
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright E2E Testing', 'Matti Luukkainen', 'https://playwright.dev')
      
      await expect(page.getByText('Playwright E2E Testing Matti Luukkainen')).toBeVisible()
    })

    // 5.20
    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Testing Likes in Playwright', 'Test Author', 'https://example.com')

      const blogElement = page.getByText('Testing Likes in Playwright')
      await blogElement.getByRole('button', { name: 'view' }).click()

      const likeButton = blogElement.locator('..').getByRole('button', { name: 'like' })
      await likeButton.click()

      await expect(blogElement.locator('..').getByText('likes 1')).toBeVisible()
    })

    // 5.21
    test('the user who created a blog can delete it', async ({ page }) => {
      await createBlog(page, 'Blog to be deleted', 'Test Author', 'https://delete.me')

      const blogElement = page.getByText('Blog to be deleted')
      await blogElement.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })

      const deleteButton = blogElement.locator('..').getByRole('button', { name: 'remove' })
      await deleteButton.click()

      await expect(page.getByText('Blog to be deleted')).not.toBeVisible()
    })

    // 5.22
    test('only the user who created the blog sees the delete button', async ({ page, request }) => {
      await createBlog(page, 'Root User Blog', 'Root', 'https://root.com')

      await request.post('/api/users', {
        data: {
          name: 'Second User',
          username: 'seconduser',
          password: 'salainen'
        }
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'seconduser', 'salainen')

      const blogElement = page.getByText('Root User Blog')
      await blogElement.getByRole('button', { name: 'view' }).click()

      const deleteButton = blogElement.locator('..').getByRole('button', { name: 'remove' })
      await expect(deleteButton).not.toBeVisible()
    })

    // 5.23
    test('blogs are ordered according to likes (most likes first)', async ({ page }) => {
      await createBlog(page, 'Blog with fewest likes', 'Author 1', 'https://likes1.com')
      await createBlog(page, 'Blog with second most likes', 'Author 2', 'https://likes2.com')
      await createBlog(page, 'Blog with most likes', 'Author 3', 'https://likes3.com')

      const viewButtons = await page.getByRole('button', { name: 'view' }).all()
      for (const button of viewButtons) {
        await button.click()
      }

      const blog1 = page.getByText('Blog with most likes').locator('..')
      await blog1.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 1').waitFor()
      await blog1.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 2').waitFor()
      await blog1.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 3').waitFor()

      const blog2 = page.getByText('Blog with second most likes').locator('..')
      await blog2.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 1').waitFor()
      await blog2.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 2').waitFor()

      const blogElements = await page.locator('.blog').all()
      await expect(blogElements[0]).toContainText('Blog with most likes')
      await expect(blogElements[1]).toContainText('Blog with second most likes')
      await expect(blogElements[2]).toContainText('Blog with fewest likes')
    })
  })
})
EOF