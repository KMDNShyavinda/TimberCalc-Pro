import axiosInstance from './api'

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials)
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token)
    }
    return response.data
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData)
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token)
    }
    return response.data
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (e) {
      console.warn('Logout request failed or user already unauthenticated:', e)
    } finally {
      localStorage.removeItem('auth_token')
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return null
    const response = await axiosInstance.get('/auth/me')
    return response.data.user
  },
}

export default authService
