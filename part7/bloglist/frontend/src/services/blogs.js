import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, newBlog) => {
  const response = await axios.put(`${ baseUrl }/${id}`, newBlog)
  console.log(response)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${ baseUrl }/${id}`, config)
}

const comment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment)
  return response.data
}

export default { setToken, getAll, create, update, remove, comment }