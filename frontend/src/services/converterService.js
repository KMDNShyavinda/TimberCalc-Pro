import api from './api'

// Endpoints for the Universal Unit Converter module
export const converterService = {
  convert: (payload) => api.post('/convert', payload),
  getCategories: () => api.get('/convert/categories'),
}

export default converterService
