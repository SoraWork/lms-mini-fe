import request from '@/utils/request'

export const studentApi = {
  // Create student
  create(data) {
    return request.post('/api/students', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Search students with pagination
  search(params) {
    return request.get('/api/students/search', { params })
  },

  // Update student
  update(id, data) {
    return request.put(`/api/students/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Delete student
  delete(id) {
    return request.delete(`/api/students/${id}`)
  },

  // Get student by ID (if needed)
  getById(id) {
    return request.get(`/api/students/${id}`)
  }
}
