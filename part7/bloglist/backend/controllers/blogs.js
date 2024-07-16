const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 }).populate('comments', { content: 1});
  // response.json(blogs.sort((a, b) => b.likes - a.likes))
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const userFromRequest = request.user;
  if (!userFromRequest) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(userFromRequest.id)
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  savedBlog.user = user
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'not found blog' })
  }

  const comment = new Comment({
    content: body.content,
    blog: blog._id
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()
  response.status(201).json(savedComment)
})

blogsRouter.delete('/:id', async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response.status(404).json({ error: 'not found blog' })
  }
  if (blogToDelete.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'a blog can be deleted only by the user who added it' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title,
      author,
      url,
      likes: likes ? likes : 0
    },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).json({ error: `Information of blog ${body.title} has already been removed from server` })
  }
})

module.exports = blogsRouter
