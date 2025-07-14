# 🌟 Shooting Star Diary - VPS Deployment Guide

## 📋 Prerequisites
- Ubuntu VPS with IP: `128.199.236.36`
- SSH access to the VPS
- GitHub repository with your code
- Domain: `vuonsaobang.biz` (pointed to your VPS IP)
- SSL Certificate (we'll set up with Let's Encrypt)

## 🚀 Complete Deployment Flow (Fresh VPS)

### 1. Initial Server Setup

```bash
# Connect to your VPS
ssh root@128.199.236.36

# Update system packages
apt update && apt upgrade -y

# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install nginx
apt install nginx -y

# Install PM2 (Process Manager)
npm install -g pm2

# Install git
apt install git -y

# Create non-root user (recommended)
adduser deployer
usermod -aG sudo deployer
su - deployer
```

### 2. Setup Project Directory

```bash
# Create web directory
sudo mkdir -p /var/www/vuonsaobang.biz
cd /var/www

# Clone your repository
sudo git clone https://github.com/your-username/shooting-star.git vuonsaobang.biz

# Change ownership to deployer user
sudo chown -R deployer:deployer /var/www/vuonsaobang.biz
```

### 3. Install Dependencies

```bash
# Install all dependencies
cd /var/www/vuonsaobang.biz

# Backend dependencies
cd backend
npm install --production

# Frontend dependencies
cd ../frontend
npm install

# Build frontend for production
npm run build

# Go back to root
cd ..
```

### 4. Environment Configuration

```bash
# Create production environment file
cd /var/www/vuonsaobang.biz/backend
cp .env.example .env

# Edit environment file
nano .env
```

**Backend `.env` content:**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/shooting_star_diary?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_for_production_make_it_long_and_random

# CORS Configuration
FRONTEND_URL=https://vuonsaobang.biz

# Security
BCRYPT_ROUNDS=12

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

**Frontend `.env` content:**
```bash
cd /var/www/vuonsaobang.biz/frontend
cp .env.example .env
nano .env
```

```env
# API Configuration
VITE_API_URL=https://vuonsaobang.biz/api

# App Configuration
VITE_APP_NAME=Vườn Sao Băng
VITE_APP_VERSION=2.0.0
```

### 5. PM2 Configuration

Create PM2 ecosystem file:

```bash
cd /var/www/vuonsaobang.biz
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'shooting-star-backend',
      script: 'server.js',
      cwd: '/var/www/vuonsaobang.biz/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_file: '/var/www/vuonsaobang.biz/backend/.env',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/shooting-star-backend-error.log',
      out_file: '/var/log/pm2/shooting-star-backend-out.log',
      log_file: '/var/log/pm2/shooting-star-backend-combined.log',
      time: true
    }
  ]
};
```

### 6. SSL Certificate Setup (Let's Encrypt)

```bash
# Install certbot
ssudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d vuonsaobang.biz
```

### 7. Nginx Configuration

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/vuonsaobang.biz
```

```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name vuonsaobang.biz www.vuonsaobang.biz 128.199.236.36;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name vuonsaobang.biz www.vuonsaobang.biz;

    # Root directory for frontend
    root /var/www/vuonsaobang.biz/frontend/dist;
    index index.html;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/vuonsaobang.biz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vuonsaobang.biz/privkey.pem;

    # Frontend routes - SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API routes - proxy to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /(\.env|\.git|node_modules) {
        deny all;
    }
}
```

```bash
# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx

# Update nginx config with SSL (use the full config from step 6)
sudo nano /etc/nginx/sites-available/vuonsaobang.biz
```

### 8. Enable Nginx Site

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/vuonsaobang.biz /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 9. Start Application

```bash
# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R deployer:deployer /var/log/pm2

# Start backend with PM2
cd /var/www/vuonsaobang.biz
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Test Application

```bash
# Test API directly
curl https://vuonsaobang.biz/api/health

# Test frontend
curl -I https://vuonsaobang.biz

# Check logs
pm2 logs shooting-star-backend
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 🎉 Deployment Complete!

Your Shooting Star Diary application is now deployed at:
- **Website:** https://vuonsaobang.biz
- **API:** https://vuonsaobang.biz/api