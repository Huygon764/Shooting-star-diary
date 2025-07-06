# ✨ Vườn Sao Băng (Shooting Star Diary) ✨

A beautiful, animated diary application where users can share their thoughts and feelings with the stars. Built with Vue.js 3, Express.js, MongoDB, and integrated with Telegram notifications.

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** with Composition API
- **Vite** for fast development and building
- **CSS3** with custom animations and transitions
- **Environment Variables** for configuration

### Backend
- **Node.js** with ES Modules
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Axios** for HTTP requests to Telegram API

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Telegram Bot (optional, for notifications)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shooting-star
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file from example:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shooting-star-diary

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:5174

# Security
BCRYPT_ROUNDS=12

# Telegram Bot Configuration (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file from example:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Vườn Sao Băng
VITE_APP_VERSION=2.0.0
```

### 4. Start the Application

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

The application will be available at:
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

## 🎯 Usage

### Default User Account
- **Username**: Bae
- **Password**: 27022004

### Login
1. Open the application in your browser
2. Enter the password for the "Bae" account
3. Enjoy the animated starry interface!

### Writing Diary Entries
1. Click on the text area to see sparkle effects
2. Write your thoughts and feelings
3. Click "Gửi lên những vì sao 🌟" to save
4. Watch the shooting star animation!

### Telegram Notifications
If configured, you'll receive beautiful Telegram messages for:
- User logins
- New diary entries (if not marked private)

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (auth required)

### Diary Entries
- `GET /api/entries` - Get all entries
- `POST /api/entries` - Create new entry (auth required)
- `GET /api/entries/:id` - Get specific entry
- `PUT /api/entries/:id` - Update entry (auth required)
- `DELETE /api/entries/:id` - Delete entry (auth required)
- `GET /api/entries/user/:userId` - Get user's entries

### System
- `GET /api/health` - Health check
- `GET /api/` - API documentation

## 🔧 Telegram Bot Setup

### 1. Create a Telegram Bot
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions
3. Save the bot token you receive

### 2. Get Your Chat ID
1. Start a conversation with your bot
2. Send any message to your bot
3. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your chat ID in the response

### 3. Configure Environment Variables
Add to your backend `.env` file:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Configure a reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve the `dist` folder with any static file server
3. Configure environment variables for production API URL

## 🧪 Development

### Project Structure
```
shooting-star/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── utils/             # Utility functions
├── frontend/               # Vue.js client application
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── config/        # App configuration
│   │   └── assets/        # Static assets
└── README.md              # This file
```

### Key Components
- **LoginForm.vue**: Authentication interface
- **EntryList.vue**: Display saved diary entries
- **telegramService.js**: Telegram bot integration
- **userController.js**: User management logic
- **entryController.js**: Diary entry logic

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running
- Check the MONGODB_URI in your .env file

**Telegram Notifications Not Working**
- Verify TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
- Ensure the bot has permission to send messages to the chat

**Frontend Can't Connect to Backend**
- Check that both servers are running
- Verify the VITE_API_URL in frontend .env

**Authentication Issues**
- Clear browser localStorage
- Check JWT_SECRET configuration

## 📝 Version History

### v2.0.0 (Current)
- ✅ Full Vue.js 3 + Express.js + MongoDB stack
- ✅ JWT Authentication system
- ✅ Telegram bot integration
- ✅ User management
- ✅ Environment variable configuration
- ✅ ES Modules throughout
- ✅ Responsive design
- ✅ Input validation and error handling

### v1.0.0 (Original)
- Plain HTML/CSS/JavaScript implementation
- Local storage for data persistence
- Basic animations and styling

## 🎉 Credits

Built with love for sharing thoughts with the stars ✨

### Technologies Used
- Vue.js 3 & Composition API
- Express.js & Node.js
- MongoDB & Mongoose
- Telegram Bot API
- JWT Authentication
- Vite Build Tool

## 📝 License

This project is for personal use. Please respect the Vietnamese language and cultural elements.
