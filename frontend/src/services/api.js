import axios from 'axios'
import { mockProducts, mockReviews } from '../data/mockData'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083',
  timeout: 8000,
})

export const apiClient = {
  products: {
    async list() {
      try {
        const response = await api.get('/api/produtos')
        return response.data
      } catch {
        return mockProducts
      }
    },
    async featured() {
      const products = await this.list()
      return products.filter((product) => product.featured)
    },
    async byId(id) {
      try {
        const response = await api.get(`/api/produtos/${id}`)
        return response.data
      } catch {
        return mockProducts.find((product) => String(product.id) === String(id))
      }
    },
  },
  auth: {
    async login(payload) {
      try {
        const response = await api.post('/api/auth/login', payload)
        return response.data
      } catch {
        return { token: 'mock-token', user: { name: payload.email.split('@')[0], email: payload.email } }
      }
    },
    async register(payload) {
      try {
        const response = await api.post('/api/auth/register', payload)
        return response.data
      } catch {
        return { token: 'mock-token', user: { name: payload.name, email: payload.email } }
      }
    },
  },
  orders: {
    async list() {
      try {
        const response = await api.get('/api/pedidos')
        return response.data
      } catch {
        return []
      }
    },
    async create(payload) {
      try {
        const response = await api.post('/api/pedidos', payload)
        return response.data
      } catch {
        return { id: Date.now(), ...payload, status: 'confirmado', createdAt: new Date().toISOString() }
      }
    },
  },
  reviews: {
    async listByProduct(productId) {
      try {
        const response = await api.get(`/api/produtos/${productId}/avaliacoes`)
        return response.data
      } catch {
        return mockReviews[productId] || []
      }
    },
    async create(productId, payload) {
      try {
        const response = await api.post(`/api/produtos/${productId}/avaliacoes`, payload)
        return response.data
      } catch {
        return { id: Date.now(), ...payload }
      }
    },
  },
}

export default api
