import axios from 'axios'
import { API_BASE_URL, DEMO_MODE } from '../utils/constants'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ulp3d_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ulp3d_token')
    }
    return Promise.reject(error)
  },
)

export function isDemoMode(): boolean {
  return DEMO_MODE
}

export function simulateLatency<T>(data: T, ms = 450): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms)
  })
}

export async function apiOrMock<T>(
  request: Promise<{ data: T }>,
  mockData: () => T,
): Promise<T> {
  if (DEMO_MODE) {
    return simulateLatency(mockData())
  }
  const response = await request
  return response.data
}