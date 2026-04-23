import { api } from './client.js'

export async function loginRequest({ email, password }) {
  const { data } = await api.post('/api/auth/student/login', { email, password })
  return data
}

export async function registerRequest({ name, email, password }) {
  const { data } = await api.post('/api/auth/student/register', { name, email, password })
  return data
}

export async function changePasswordRequest({ email, currentPassword, newPassword }) {
  const { data } = await api.post('/api/auth/change-password', {
    email,
    currentPassword,
    newPassword,
  })
  return data
}

