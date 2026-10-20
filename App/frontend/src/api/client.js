import axios from 'axios';

const http = axios.create({ baseURL: '/api' });

// Mirrors the shape the pages previously called on the old vanilla-JS
// SPEAK.request helper: request(path, { method, body, token }).
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  try {
    const res = await http.request({
      url: path,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || 'Request failed.';
    throw new Error(message);
  }
}

export default http;
