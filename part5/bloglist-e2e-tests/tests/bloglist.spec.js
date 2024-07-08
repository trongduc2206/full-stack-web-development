const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Jussi Imonnen',
        username: 'test',
        password: '123456'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginHeading = await page.getByRole('heading', { name: 'log in to application'})
    const loginInput = await page.getByTestId('username')
    const passwordInput = await page.getByTestId('password')
    const loginButton =  await page.getByRole('button', { name: 'login'})
    expect(loginHeading).toBeVisible
    expect(loginInput).toBeVisible
    expect(passwordInput).toBeVisible
    expect(loginButton).toBeVisible
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrong', 'salainen')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'author', 'https://playwright/test')
      await expect(page.getByText('a blog created by playwright author')).toBeVisible()
    })

    test('a new blog can be liked', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'author', 'https://playwright/test')
      
      await likeBlog(page, 'a blog created by playwright', 'author', 1)
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({page}) => {
      await createBlog(page, 'a blog created by playwright', 'author', 'https://playwright/test')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'remove'}).click()
      page.on('dialog', dialog => dialog.accept());
      await expect(page.getByText('a blog created by playwright author', {exact: true})).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button of that blog', async ({page}) => {
      await createBlog(page, 'a blog created by playwright', 'author', 'https://playwright/test')

      await page.getByRole('button', { name: 'logout' }).click() 

      await loginWith(page, 'test', '123456')

      await expect(page.getByText('a blog created by playwright author')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('the blogs are arranged in the order according to the likes', async ({page}) => {
      await createBlog(page, 'first blog', 'first author', 'first url');
      await createBlog(page, 'second blog', 'second author', 'second url');
      await createBlog(page, 'third blog', 'third author', 'third url');

      await likeBlog(page, 'first blog', 'first author', 1)

      await likeBlog(page, 'second blog', 'second author', 2)

      await likeBlog(page, 'third blog', 'third author', 3)
      const blogs = await page.locator('.blogDefaultInfo').all()
      await expect(blogs[0]).toHaveText(/third blog third author/)
      await expect(blogs[1]).toHaveText(/second blog second author/)
      await expect(blogs[2]).toHaveText(/first blog first author/)
    })

  })
})