const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Lenon',
    url: 'http://techi.efi.com/html-easy',
    likes: 4
  },
  {
    title: 'Kubernetes hands-on',
    author: 'Annina Kim',
    url: 'http://techi.efi.com/k8s-handson',
    likes: 6
  },
]

const blogsWithEmptyTitleOrUrl = [
  {
    title: '',
    author: 'Jussi Voipio',
    url: 'http://anx.tech.com/service-design',
  },
  {
    title: 'Service design',
    author: 'Jussi Voipio',
    url: ''
  },
  {
    title: '',
    author: 'Jussi Voipio',
    url: ''
  }
]

const blogsWithoutTitleOrUrl = [
  {
    author: 'Jussi Voipio',
    url: 'http://anx.tech.com/service-design',
  },
  {
    title: 'Service design',
    author: 'Jussi Voipio',
  },
  {
    author: 'Jussi Voipio',
  }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    blogsWithEmptyTitleOrUrl,
    blogsWithoutTitleOrUrl,
    blogsInDb,
    usersInDb,
}