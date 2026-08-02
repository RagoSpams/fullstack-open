const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset test database
    await request.post('/api/testing/reset')

    // Seed test user
    await request.post('/api/users', {
      data: {
        name: 'Super User',
        username: 'root',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('root')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Super User logged in')).toBeVisible()
  })

  test('Login fails if the username/password is incorrect', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('root')
    await page.getByLabel('password').fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Super User logged in')).not.toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('username').fill('root')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a logged-in user can create a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()
      await page.getByPlaceholder('write title here').fill('Routed Blog Title')
      await page.getByPlaceholder('write author here').fill('Router Author')
      await page.getByPlaceholder('write url here').fill('https://reactrouter.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Routed Blog Title Router Author')).toBeVisible()
    })

    test('a logged-in user can like blogs', async ({ page }) => {
      // Assuming navigation to single blog view works via clicking title
      const blogLink = page.getByRole('link', { name: /Routed Blog Title/i })
      await blogLink.click()

      const likeButton = page.getByRole('button', { name: 'like' })
      await likeButton.click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a logged-in user can delete a blog', async ({ page }) => {
      const blogLink = page.getByRole('link', { name: /Routed Blog Title/i })
      await blogLink.click()

      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Routed Blog Title')).not.toBeVisible()
    })
  })
})