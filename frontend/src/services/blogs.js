import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const createConfig = () => {
  return {
    headers: { Authorization: token }
  }
};

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return  response.data
}

const create = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, createConfig());
  return response.data;
};

const like = async (id, updatedBlog) => {

  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog);
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, createConfig());
  return response.data;
}

export default { getAll, setToken, create, like, remove }