export const MESSAGES = {
  COMMON: {
    SERVER_ERROR: 'Có lỗi xảy ra trên server',
    NOT_FOUND: 'Không tìm thấy tài nguyên',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
    INVALID_ID: 'ID không hợp lệ',
    DUPLICATE_FIELD: 'Giá trị đã tồn tại',
  },

  AUTH: {
    LOGIN_SUCCESS: 'Đăng nhập thành công! 🌟',
    LOGIN_FAILED: 'Thông tin đăng nhập không chính xác',
    TOKEN_REQUIRED: 'Access token is required',
    TOKEN_INVALID: 'Invalid token',
    USER_INACTIVE: 'Tài khoản đã bị vô hiệu hóa',
    ADMIN_REQUIRED: 'Admin access required',
    CREDENTIALS_REQUIRED: 'Vui lòng nhập đầy đủ thông tin đăng nhập',
  },

  USER: {
    CREATED: 'Tài khoản đã được tạo thành công! 🌟',
    UPDATED: 'Thông tin cá nhân đã được cập nhật',
    DELETED: 'Tài khoản đã được xóa',
    NOT_FOUND: 'Không tìm thấy người dùng',
    USERNAME_EXISTS: 'Tên đăng nhập đã tồn tại',
    PASSWORD_CHANGED: 'Mật khẩu đã được thay đổi thành công',
    PASSWORD_REQUIRED: 'Vui lòng nhập đầy đủ mật khẩu',
    PASSWORD_INCORRECT: 'Mật khẩu hiện tại không chính xác',
  },

  ENTRY: {
    CREATED: 'Tâm sự đã được gửi lên những vì sao! ✨',
    UPDATED: 'Tâm sự đã được cập nhật',
    DELETED: 'Tâm sự đã được xóa',
    NOT_FOUND: 'Không tìm thấy tâm sự này',
    CONTENT_REQUIRED: 'Nội dung không được để trống',
    FETCH_ERROR: 'Có lỗi xảy ra khi lấy dữ liệu',
  },
} as const;

// Type for messages
export type Messages = typeof MESSAGES;
