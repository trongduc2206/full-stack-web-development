import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> creates new blog onSubmit', async () => {
  const createForm = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createForm} />)

  const titleInput = screen.getByPlaceholderText('title of blog')
  const authorInput = screen.getByPlaceholderText('author of blog')
  const urlInput = screen.getByPlaceholderText('url of blog')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'testing title')
  await user.type(authorInput, 'testing author')
  await user.type(urlInput, 'testing url')
  await user.click(createButton)

  expect(createForm.mock.calls).toHaveLength(1)
  expect(createForm.mock.calls[0][0].title).toBe('testing title')
  expect(createForm.mock.calls[0][0].author).toBe('testing author')
  expect(createForm.mock.calls[0][0].url).toBe('testing url')
})