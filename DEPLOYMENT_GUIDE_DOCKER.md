# 🚀 Vườn Sao Băng - VPS Deployment Guide

Hướng dẫn deploy ứng dụng lên VPS Ubuntu với Docker.

## 📋 Prerequisites

- VPS Ubuntu (22.04/24.04 LTS)
- Domain đã trỏ về IP VPS (ví dụ: `vuonsaobang.biz` → `128.199.236.36`)
- GitHub repo: `git@github.com:Huygon764/Shooting-star-diary.git`

## Step 1: SSH Key Setup

**Trên laptop:**

    # Xem public key
    cat ~/.ssh/id_rsa.pub
    # Copy toàn bộ output

**Trên VPS (đăng nhập bằng password lần đầu):**

    ssh root@<VPS_IP>

    # Tạo thư mục .ssh
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh

    # Thêm public key
    nano ~/.ssh/authorized_keys
    # Paste public key, lưu: Ctrl+X → Y → Enter

    chmod 600 ~/.ssh/authorized_keys
    exit

**Test từ laptop:**

    ssh root@<VPS_IP>
    # Không cần password nữa

> **Lỗi "REMOTE HOST IDENTIFICATION HAS CHANGED"?**
> Chạy: `ssh-keygen -R <VPS_IP>` rồi SSH lại.

## Step 2: Cài đặt Docker

    # Update system
    apt update && apt upgrade -y

    # Cài tools cần thiết
    apt install -y ca-certificates curl gnupg git nano

    # Xóa Docker cũ (nếu có)
    for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do
      apt-get remove -y $pkg 2>/dev/null
    done

    # Thêm Docker GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Thêm Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Cài Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Verify
    docker --version
    docker compose version

## Step 3: SSL Certificate

    # Cài certbot
    apt install -y certbot

    # Tạo certificate (domain phải đã trỏ về VPS)
    certbot certonly --standalone -d vuonsaobang.biz -d www.vuonsaobang.biz

    # Verify
    ls /etc/letsencrypt/live/vuonsaobang.biz/

## Step 4: Clone & Setup

    # Tạo thư mục
    mkdir -p /var/www
    cd /var/www

    # Clone repo
    git clone git@github.com:Huygon764/Shooting-star-diary.git vuonsaobang.biz
    cd vuonsaobang.biz

    # Tạo .env
    cp .env.example .env
    nano .env

**Nội dung `.env`:**

    # MongoDB Atlas
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shooting-star

    # JWT
    JWT_SECRET=your_super_secure_random_string_here
    JWT_EXPIRES_IN=30d

    # Security
    BCRYPT_ROUNDS=12

    # Frontend
    FRONTEND_URL=https://vuonsaobang.biz

    # Telegram
    TELEGRAM_BOT_TOKEN=your_bot_token
    TELEGRAM_CHAT_ID=your_chat_id
    TELEGRAM_WEBHOOK_DOMAIN=https://vuonsaobang.biz

Lưu: `Ctrl+X` → `Y` → `Enter`

## Step 5: Deploy

    # Build và chạy
    docker compose -f docker-compose.prod.yml up -d --build

    # Xem logs
    docker compose -f docker-compose.prod.yml logs -f

    # Verify
    curl https://vuonsaobang.biz/api/health

## 📝 Commands thường dùng

| Command | Description |
|---------|-------------|
| `docker compose -f docker-compose.prod.yml logs -f` | Xem logs |
| `docker compose -f docker-compose.prod.yml logs -f backend` | Logs backend |
| `docker compose -f docker-compose.prod.yml restart` | Restart all |
| `docker compose -f docker-compose.prod.yml down` | Stop all |
| `docker compose -f docker-compose.prod.yml ps` | Xem status |
| `docker system prune -f` | Dọn dẹp images cũ |

**Update code mới:**

    cd /var/www/vuonsaobang.biz
    git pull
    docker compose -f docker-compose.prod.yml up -d --build

## 🔧 Troubleshooting

**Port 80/443 đã được dùng:**

    # Xem process
    sudo lsof -i :80
    sudo kill -9 <PID>

**SSL certificate lỗi:**

    # Stop docker, tạo lại cert
    docker compose -f docker-compose.prod.yml down
    certbot certonly --standalone -d vuonsaobang.biz
    docker compose -f docker-compose.prod.yml up -d

**Xem logs lỗi:**

    docker compose -f docker-compose.prod.yml logs --tail=100 backend
    docker compose -f docker-compose.prod.yml logs --tail=100 frontend

## 🔄 Auto-renew SSL

    # Mở crontab
    crontab -e

    # Thêm dòng này (chạy mỗi tháng)
    0 3 1 * * certbot renew --pre-hook "docker compose -f /var/www/vuonsaobang.biz/docker-compose.prod.yml down" --post-hook "docker compose -f /var/www/vuonsaobang.biz/docker-compose.prod.yml up -d"

---

## 🎉 Done!

- Website: https://vuonsaobang.biz
- API: https://vuonsaobang.biz/api/health
