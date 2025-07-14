# ✨ Vườn Sao Băng (Shooting Star Diary) ✨

Một ứng dụng nhật ký đẹp mắt và có hoạt ảnh, nơi người dùng có thể chia sẻ suy nghĩ và cảm xúc của mình với những vì sao. Được xây dựng bằng Vue.js 3, Express.js, MongoDB và tích hợp thông báo Telegram.

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Vue.js 3** với Composition API
- **Vite** để phát triển và build nhanh chóng
- **CSS3** với hoạt ảnh và chuyển tiếp tùy chỉnh

### Backend
- **Node.js** với ES Modules
- **Express.js** web framework
- **MongoDB** với Mongoose ODM

## 📦 Cài Đặt & Thiết Lập

### Yêu Cầu Hệ Thống
- Node.js (phiên bản 16 trở lên)
- MongoDB (local hoặc cloud)
- Telegram Bot (tùy chọn, cho thông báo)

### 1. Clone Repository
```bash
git clone <repository-url>
cd shooting-star
```

### 2. Thiết Lập Backend
```bash
cd backend
npm install
```

Tạo file `.env` từ ví dụ:
```bash
cp .env.example .env
```

Cấu hình các biến môi trường trong `.env`:
```env
# Cấu hình Server
PORT=5000
NODE_ENV=development

# Cấu hình Database
MONGODB_URI=mongodb://localhost:27017/shooting-star-diary

# Cấu hình JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Cấu hình CORS
FRONTEND_URL=http://localhost:5174

# Bảo mật
BCRYPT_ROUNDS=12

# Cấu hình Telegram Bot (Tùy chọn)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 3. Thiết Lập Frontend
```bash
cd frontend
npm install
```

Tạo file `.env` từ ví dụ:
```bash
cp .env.example .env
```

Cấu hình các biến môi trường trong `.env`:
```env
# Cấu hình API
VITE_API_URL=http://localhost:5000/api

# Cấu hình App
VITE_APP_NAME=Vườn Sao Băng
VITE_APP_VERSION=2.0.0
```

### 4. Khởi Chạy Ứng Dụng

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

Ứng dụng sẽ có sẵn tại:
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

## 🎯 Cách Sử Dụng

### Đăng Nhập
1. Mở ứng dụng trong trình duyệt
2. Nhập mật khẩu cho tài khoản, tự tạo tài khoản (Hiện đang để default 1 tài khoản là Bae)
3. Tận hưởng giao diện sao lấp lánh!

### Viết Nhật Ký
1. Click vào vùng văn bản để thấy hiệu ứng lấp lánh
2. Viết suy nghĩ và cảm xúc của bạn
3. Click "Gửi lên những vì sao 🌟" để lưu

### Thông Báo Telegram
Nếu được cấu hình, bạn sẽ nhận được tin nhắn Telegram đẹp mắt cho:
- Đăng nhập của người dùng
- Bài viết nhật ký mới (nếu không được đánh dấu riêng tư)

## 🔧 API Endpoints

### Hệ Thống
- `GET /api/health` - Kiểm tra sức khỏe
- `GET /api/` - Tài liệu API

## 🔧 Thiết Lập Telegram Bot

### 1. Tạo Telegram Bot
1. Nhắn tin cho [@BotFather](https://t.me/BotFather) trên Telegram
2. Gửi `/newbot` và làm theo hướng dẫn
3. Lưu bot token bạn nhận được

### 2. Lấy Chat ID
1. Bắt đầu cuộc trò chuyện với bot của bạn
2. Gửi bất kỳ tin nhắn nào cho bot
3. Truy cập `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Tìm chat ID trong phản hồi

### 3. Cấu Hình Biến Môi Trường
Thêm vào file `.env` backend:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```
## 🧪 Phát Triển

### Cấu Trúc Dự Án
```
shooting-star/
├── backend/                 # Express.js API server
│   ├── config/             # Cấu hình database
│   ├── controllers/        # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── utils/             # Utility functions
├── frontend/               # Vue.js client application
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── config/        # Cấu hình app
│   │   └── assets/        # Static assets
└── README.md              # File này
```

## 📝 Giấy Phép

Dự án này dành cho mục đích sử dụng cá nhân. Hãy tôn trọng ngôn ngữ Việt Nam và các yếu tố văn hóa.
