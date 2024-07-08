import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let handleLike
  beforeEach(() => {
    const blog = {
      title: 'Tailwind CSS',
      author: 'Kevin Murphin',
      url: 'https://cssdom.fi/tailwind',
      likes: 10,
      user: {
        name: 'Jussi Voipio'
      }
    }
    handleLike = vi.fn()
    const handleRemove = vi.fn()
    const user = {
      name: 'Mark Lenon'
    }
    container = (render(<Blog blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user} />)).container
  })

  test('renders only title and author by default', () => {
    const title = screen.getByText('Tailwind CSS', { exact: false })
    const author = screen.getByText('Kevin Murphin', { exact: false })
    const detail = container.querySelector('.blogDetail')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(detail).toHaveStyle('display: none')
  })

  test('renders blog detail when user clicks view button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const detail = container.querySelector('.blogDetail')
    expect(detail).not.toHaveStyle('display: none')
  })

  test('click like button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(handleLike.mock.calls).toHaveLength(2)
  })
})