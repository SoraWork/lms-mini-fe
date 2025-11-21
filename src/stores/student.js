import { defineStore } from 'pinia'
import { studentApi } from '@/api'
import { ElMessage } from 'element-plus'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    currentStudent: null,
    pagination: {
      page: 0,
      size: 10,
      total: 0,
      totalPages: 0
    },
    loading: false,
    searchParams: {
      name: '',
      email: ''
    }
  }),

  getters: {
    getStudents: (state) => state.students,
    getPagination: (state) => state.pagination,
    isLoading: (state) => state.loading
  },

  actions: {
    // Search students
    async searchStudents(params = {}) {
      this.loading = true
      try {
        const searchParams = {
          page: params.page || this.pagination.page,
          size: params.size || this.pagination.size,
          ...this.searchParams,
          ...params
        }

        const response = await studentApi.search(searchParams)
        this.students = response.data.content || response.data
        this.pagination = {
          page: response.data.number || searchParams.page,
          size: response.data.size || searchParams.size,
          total: response.data.totalElements || response.data.total,
          totalPages: response.data.totalPages || 0
        }

        return response.data
      } catch (error) {
        ElMessage.error('Tải danh sách học sinh thất bại')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Create student
    async createStudent(studentData) {
      try {
        const response = await studentApi.create(studentData)
        ElMessage.success('Tạo học sinh thành công')
        return response.data
      } catch (error) {
        ElMessage.error('Tạo học sinh thất bại')
        throw error
      }
    },

    // Update student
    async updateStudent(id, studentData) {
      try {
        const response = await studentApi.update(id, studentData)
        ElMessage.success('Cập nhật học sinh thành công')
        return response.data
      } catch (error) {
        ElMessage.error('Cập nhật học sinh thất bại')
        throw error
      }
    },

    // Delete student
    async deleteStudent(id) {
      try {
        await studentApi.delete(id)
        ElMessage.success('Xóa học sinh thành công')
        // Refresh the list
        await this.searchStudents()
      } catch (error) {
        ElMessage.error('Xóa học sinh thất bại')
        throw error
      }
    },

    // Set search parameters
    setSearchParams(params) {
      this.searchParams = { ...this.searchParams, ...params }
    },

    // Clear search parameters
    clearSearchParams() {
      this.searchParams = {
        name: '',
        email: ''
      }
    }
  }
})
