import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getEvents = () => API.get('/events');
export const createEvent = (body) => API.post('/events', body);
export const updateEvent = (id, body) => API.put(`/events/${id}`, body);
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const getSwappable = () => API.get('/swappable-slots');
export const createSwapRequest = (body) => API.post('/swap-request', body);
export const getSwapRequests = () => API.get('/swap-requests');
export const respondSwap = (requestId, body) => API.post(`/swap-response/${requestId}`, body);
