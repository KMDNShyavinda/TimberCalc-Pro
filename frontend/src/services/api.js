import axios from 'axios'

// Base axios instance pointing to the Laravel backend API
// In dev, Vite proxies /api -> http://localhost:8000 (see vite.config.js)
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach auth token (Laravel Sanctum) if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
