# ✨ Vườn Sao Băng ✨

Ứng dụng nhật ký với hiệu ứng sao băng, nơi gửi gắm tâm sự lên những vì sao.

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Vue.js 3, Vite, TypeScript, Tailwind CSS, TanStack Query |
| Backend | Node.js, Express.js, TypeScript, MongoDB, Mongoose |
| DevOps | Docker, Nginx, Telegram Bot |

## 🚀 Quick Start

### Local Development

**Backend:**

    cd backend
    yarn install
    cp .env.example .env
    yarn dev

**Frontend (terminal khác):**

    cd frontend
    yarn install
    cp .env.example .env
    yarn dev

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Docker

    docker compose up -d --build
    docker compose logs -f

Truy cập: http://localhost:8080

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/shooting-star` |
| `JWT_SECRET` | JWT secret key | `your_secret_key` |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | `123456:ABC...` |
| `TELEGRAM_CHAT_ID` | Admin chat ID | `123456789` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | App name | `Vườn Sao Băng` |

## 🤖 Telegram Bot

1. Tạo bot với [@BotFather](https://t.me/BotFather) → lấy `BOT_TOKEN`
2. Gửi tin nhắn cho bot, truy cập `https://api.telegram.org/bot<TOKEN>/getUpdates` → lấy `CHAT_ID`
3. Thêm vào `backend/.env`

**Commands:**
- `/register <username> <password>` - Tạo user
- `/remove <username>` - Xóa user
- `/list` - Danh sách users

## 📁 Project Structure

    shooting-star/
    ├── backend/
    │   ├── src/
    │   │   ├── config/        # Database, env config
    │   │   ├── controllers/   # Route handlers
    │   │   ├── middleware/    # Auth, validation
    │   │   ├── models/        # Mongoose models
    │   │   ├── routes/        # API routes
    │   │   ├── services/      # Telegram services
    │   │   └── utils/         # Helpers
    │   ├── Dockerfile
    │   └── package.json
    ├── frontend/
    │   ├── src/
    │   │   ├── components/    # Vue components
    │   │   ├── views/         # Pages
    │   │   ├── stores/        # Pinia stores
    │   │   ├── hooks/         # Composables
    │   │   └── config/        # App config
    │   ├── Dockerfile
    │   └── package.json
    ├── docker-compose.yml
    └── README.md

## 📝 Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn typecheck` | Check TypeScript types |
| `docker compose up -d` | Start with Docker |
| `docker compose logs -f` | View logs |

---

Made with 💜 for personal use