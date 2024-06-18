import axios from 'axios'
const api_key = import.meta.env.VITE_API_KEY
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}`

const get = (lat, lon) => {
  const request = axios.get(`${baseUrl}&lat=${lat}&lon=${lon}&units=metric`);
  return request.then(response => response.data)
}

export default { get }