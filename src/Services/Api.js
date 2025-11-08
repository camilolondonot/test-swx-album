import axios from 'axios'

const api = axios.create({
  baseURL: 'https://swapi.dev/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getData = async (endpoint, id) => {
  if (id) {
    const response = await api.get(`${endpoint}/${id}`)
    return response.data
  }

  const response = await api.get(endpoint)
  return response.data
}

const normalizeUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) {
    return url.replace(api.defaults.baseURL, '')
  }
  return url
}

export const getAllData = async (endpoint) => {
  let url = endpoint
  let aggregated = []
  let firstResponse = null

  while (url) {
    const response = await api.get(url)
    const { data } = response

    if (!firstResponse) {
      firstResponse = data
    }

    aggregated = aggregated.concat(data?.results ?? [])
    url = normalizeUrl(data?.next)
  }

  if (!firstResponse) {
    return {
      count: 0,
      results: [],
    }
  }

  return {
    ...firstResponse,
    count: aggregated.length,
    results: aggregated,
    next: null,
    previous: null,
  }
}

export const getResourceByUrl = async (url) => {
  if (!url) return null
  const isAbsolute = /^https?:\/\//i.test(url)
  if (isAbsolute) {
    const response = await axios.get(url)
    return response.data
  }
  const normalized = url.startsWith('/') ? url.slice(1) : url
  const response = await api.get(normalized)
  return response.data
}

export default api