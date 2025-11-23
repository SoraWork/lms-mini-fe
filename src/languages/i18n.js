import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    course: {
      add: 'Add Course',
      name: 'Course Name',
      code: 'Course Code',
      totalEnrollments: 'Total Enrollments',
      totalLessons: 'Total Lessons',
      status: 'Status',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      noData: 'No data',
      formTitle: 'Course Form',
      confirmDelete: 'Are you sure to delete this course?',
      deleteTitle: 'Confirm Delete',
      confirm: 'Confirm',
      cancel: 'Cancel',
      deleteSuccess: 'Course deleted successfully!',
      updateSuccess: 'Course updated!',
      createSuccess: 'Course created!',
      deleteError: 'An error occurred while deleting the course',
      submitError: 'Cannot submit course.',
      fetchError: 'Cannot fetch courses.',
      studentList: "Student List",
      viewDetail: "Course Detail",
      active: "Active",
      inactive: "Inactive",
      fetchDetailError: "Cannot fetch course detail.",
      viewStudents:"View student",
      viewLessons:"View lesson",
      title:"Course List",
      exportExcel: "Export courses to excell",
      validate: {
        nameRequired: "Course name is required",
        nameLength: "Course name is between 3 and 100 characters",
        codeRequired: "Course code is required",
      }
    },

    student: {
      add: 'Add Student',
      name: 'Student Name',
      email: 'Email',
      totalEnrollments: 'Total Enrollments',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      noData: 'No data',
      formTitle: 'Student Form',
      confirmDelete: 'Are you sure to delete this student?',
      deleteTitle: 'Confirm Delete',
      confirm: 'Confirm',
      cancel: 'Cancel',
      deleteSuccess: 'Student deleted successfully!',
      updateSuccess: 'Student updated!',
      createSuccess: 'Student created!',
      deleteError: 'An error occurred while deleting the student',
      submitError: 'Cannot submit student.',
      fetchError: 'Cannot fetch students.',
      register:"Register Course",
      exportExcel: "Export students to excell",
      validate: {
        nameRequired: "Student name is required",
        nameLength: "Student name is between 3 and 100 characters",
        emailRequired: "Email is required",
        emailPaten: "Email is not correct format",
      }
    },

    common: {
      pageNotFound: '404 - Page Not Found',
      notFoundMsg: 'The page you are looking for does not exist.',
      searchPlaceholder: 'Search...',
      language: 'Language',
      edit: "Edit",
      delete:"Delete",
      warning:"Warning"
    },

    /* ---------- FORM COMMON TEXT ---------- */
    form: {
      title: 'Form',
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update',
      images: 'Images',
      uploadImages: 'Upload Images',
      uploading: 'Uploading...',
      uploadSuccess: 'Upload images successfully!',
      uploadFailed: 'Failed to upload images.',
      cloudinaryError: 'Cloudinary upload failed',
      videos:"Videos"
    },
    pagination: {
      total: 'Total: {n} elements',
      goTo: 'Go to:',
      go: 'Go'
    },
    search: {
      title: 'Search',
      title_vi: 'Tìm kiếm',
      by: 'Search by',
      placeholder: 'Enter keywords...',
    },
    sidebar: {
      studentManager: 'Student Manager',
      courses: 'Courses',
      enrollment: 'Enrollment',
      more: 'More Features',
      report: 'Report',
      analytics: 'Analytics',
      collapse: 'Collapse'
    },
    navbar: {
      dashboard: "Dashboard",
      language: "Language",
      vietnamese: "Vietnamese",
      english: "English",
      profile: "Profile",
      logout: "Logout",
      admin: "Admin",
      developing: "This feature is under development!"
    },
    lesson: {
      list: "Lesson List",
      title: "Title",
      image: "Image",
      video: "Video",
      status: "Status",
      noImage: "No Image",
      noVideo: "No Video",
      breadcrumbs: "Lessons",
      addNew:"Add New Lesson",
      deleteConfirm: "Are You Sure?",
      edit: "Edit Lesson",
    },
    page404: {
      title: "404 - Page Not Found",
      message: "The page you requested could not be found."
    }


  },

  vi: {
    course: {
      add: 'Thêm khóa học',
      name: 'Tên khóa học',
      code: 'Mã khóa học',
      totalEnrollments: 'Tổng đăng ký',
      totalLessons: 'Tổng bài học',
      status: 'Trạng thái',
      view: 'Xem',
      edit: 'Sửa',
      delete: 'Xóa',
      noData: 'Không có dữ liệu',
      formTitle: 'Form Khóa học',
      confirmDelete: 'Bạn có chắc chắn muốn xóa khóa học này?',
      deleteTitle: 'Xác nhận xóa',
      confirm: 'Đồng ý',
      cancel: 'Hủy',
      deleteSuccess: 'Xóa khóa học thành công!',
      updateSuccess: 'Khóa học đã được cập nhật!',
      createSuccess: 'Khóa học đã được tạo!',
      deleteError: 'Đã xảy ra lỗi khi xóa khóa học',
      submitError: 'Không thể gửi thông tin khóa học.',
      fetchError: 'Không thể tải dữ liệu khóa học.',
      studentList: "Danh sách sinh viên",
      viewDetail: "Chi tiết khóa học",
      active: "Đang hoạt động",
      inactive: "Ngừng hoạt động",
      fetchDetailError: "Không thể tải dữ liệu khóa học.",
      viewStudents:"Xem học sinh",
      viewLessons:"Xem bài học",
      title:"Danh sách khóa học",
      exportExcel: "Xuất excell khóa học",
      validate: {
        nameRequired: "Tên khóa học không được để trống",
        nameLength: "Tên khóa học từ 3 đến 100 ký tự",
        codeRequired: "Mã khóa học không được để trống",
      }
    },

    student: {
      add: 'Thêm sinh viên',
      name: 'Tên sinh viên',
      email: 'Email',
      totalEnrollments: 'Tổng đăng ký',
      view: 'Xem',
      edit: 'Sửa',
      delete: 'Xóa',
      noData: 'Không có dữ liệu',
      formTitle: 'Form Sinh viên',
      confirmDelete: 'Bạn có chắc chắn muốn xóa sinh viên này?',
      deleteTitle: 'Xác nhận xóa',
      confirm: 'Đồng ý',
      cancel: 'Hủy',
      deleteSuccess: 'Xóa sinh viên thành công!',
      updateSuccess: 'Sinh viên đã được cập nhật!',
      createSuccess: 'Sinh viên đã được tạo!',
      deleteError: 'Đã xảy ra lỗi khi xóa sinh viên',
      submitError: 'Không thể gửi thông tin sinh viên.',
      fetchError: 'Không thể tải dữ liệu sinh viên.',
      register:"Đăng ký khóa học",
      exportExcel: "Xuất excell học sinh",
      validate: {
        nameRequired: "Tên k dđc để trống",
        nameLength: "Tên phải từ 3 đến 100 ký tự",
        emailRequired: "Email không đc đẻ trống",
        emailPaten: "Email không đúng định dạng",
      }
    },

    common: {
      pageNotFound: '404 - Không tìm thấy trang',
      notFoundMsg: 'Không tìm thấy trang bạn yêu cầu.',
      searchPlaceholder: 'Tìm kiếm...',
      language: 'Ngôn ngữ',
      edit: "Sửa",
      delete:"Xóa",
      warning:"Cảnh báo"
    },

    /* ---------- FORM COMMON TEXT ---------- */
    form: {
      title: 'Biểu mẫu',
      cancel: 'Hủy',
      create: 'Tạo mới',
      update: 'Cập nhật',
      images: 'Hình ảnh',
      uploadImages: 'Tải ảnh lên',
      uploading: 'Đang tải...',
      uploadSuccess: 'Tải ảnh thành công!',
      uploadFailed: 'Tải ảnh thất bại.',
      cloudinaryError: 'Lỗi tải lên Cloudinary',
      videos:"Videos"
    },
    pagination: {
      total: 'Tổng: {n} mục',
      goTo: 'Đi tới:',
      go: 'Đi'
    },
    search: {
      title: 'Tìm kiếm',
      by: 'Tìm theo',
      placeholder: 'Nhập từ khóa...',
    },
    sidebar: {
      studentManager: 'Quản lý sinh viên',
      courses: 'Khóa học',
      enrollment: 'Đăng ký khóa học',
      more: 'Tính năng khác',
      report: 'Báo cáo',
      analytics: 'Phân tích',
      collapse: 'Thu gọn'
    },
    navbar: {
      dashboard: "Bảng điều khiển",
      language: "Ngôn ngữ",
      vietnamese: "Tiếng Việt",
      english: "English",
      profile: "Hồ sơ",
      logout: "Đăng xuất",
      admin: "Quản trị",
      developing: "Chức năng đang được phát triển!"
    },
    lesson: {
      list: "Danh sách bài học",
      title: "Tiêu đề",
      image: "Hình ảnh",
      video: "Video",
      status: "Trạng thái",
      noImage: "Không có ảnh",
      noVideo: "Không có video",
      breadcrumbs: "Bài học",
      addNew:"Thêm bài học",
      deleteConfirm: "Bạn chắc chứ",
      edit: "Sửa bài học",
    },
    page404: {
      title: "404 - Không tìm thấy trang",
      message: "Không tìm thấy trang bạn yêu cầu."
    }

  }
}

export const i18n = createI18n({
  locale: 'vi',
  fallbackLocale: 'en',
  messages,
})
