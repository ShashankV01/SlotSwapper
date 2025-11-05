// frontend/src/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function token() {
  return localStorage.getItem('token');
}

const client = axios.create({ baseURL: BASE });

client.interceptors.request.use(cfg => {
  const t = token();
  if (t) cfg.headers.Authorization = 'Bearer ' + t;
  return cfg;
});

// Auth
export async function signup(data) { return client.post('/auth/signup', data).then(r => r.data); }
export async function login(data) { return client.post('/auth/login', data).then(r => r.data); }

// Events
export async function createEvent(data) { return client.post('/events', data).then(r => r.data); }
export async function getMyEvents() { return client.get('/events/mine').then(r => r.data); }
export async function updateEvent(id, data) { return client.put(`/events/${id}`, data).then(r => r.data); }
export async function deleteEvent(id) { return client.delete(`/events/${id}`).then(r => r.data); }

// Swaps
export async function getSwappables() { return client.get('/swaps/swappable-slots').then(r => r.data); }
export async function makeSwapRequest(payload) { return client.post('/swaps/swap-request', payload).then(r => r.data); }
export async function getMyRequests() { return client.get('/swaps/my-requests').then(r => r.data); }
export async function respondSwap(id, accept) { return client.post(`/swaps/swap-response/${id}`, { accept }).then(r => r.data); }
