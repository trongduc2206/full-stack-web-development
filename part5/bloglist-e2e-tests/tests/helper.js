const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title of blog').fill(title)
    await page.getByPlaceholder('author of blog').fill(author)
    await page.getByPlaceholder('url of blog').fill(url)
    await page.getByRole('button', { name: 'create' }).click()   
}

const likeBlog = async (page, title, author, numOfLikes) => {
    const blogElement = await page.getByText(`${title} ${author}`)
    await blogElement.getByRole('button', { name: 'view' }).click()
    for(let i = 1; i <= numOfLikes; i++) {
        await blogElement.locator('..').getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(400)
    }
}

export { loginWith, createBlog, likeBlog }