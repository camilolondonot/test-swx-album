import axios from 'axios';

const api = axios.create({
  baseURL: 'https://swapi.dev/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getData = async (endpoint, id) => {
  if (id) {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } else {
    const response = await api.get(endpoint);
    return response.data;
  }
};


export default api;