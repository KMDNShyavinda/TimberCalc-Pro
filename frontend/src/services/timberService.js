import api from './api'

// Endpoints for the Timber Volume Calculator module
export const timberService = {
  calculate: (payload) => api.post('/timber/calculate', payload),
  getHistory: (params) => api.get('/timber/history', { params }),
  deleteHistoryItem: (id) => api.delete(`/timber/history/${id}`),
}

export default timberService
