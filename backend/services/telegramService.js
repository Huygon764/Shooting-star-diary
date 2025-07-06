import axios from 'axios';

class TelegramService {
  constructor() {
    this._initialized = false;
  }

  // Initialize the service with environment variables
  _init() {
    if (!this._initialized) {
      this.botToken = process.env.TELEGRAM_BOT_TOKEN;
      this.chatId = process.env.TELEGRAM_CHAT_ID;
      this.baseURL = `https://api.telegram.org/bot${this.botToken}`;
      this._initialized = true;
    }
  }

  // Check if Telegram bot is configured
  isConfigured() {
    this._init();
    return !!(this.botToken && this.chatId);
  }

  // Send a simple text message
  async sendMessage(text, options = {}) {
    this._init();
    
    if (!this.isConfigured()) {
      console.warn('❌ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env');
      return false;
    }

    try {
      const payload = {
        chat_id: this.chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...options
      };

      const response = await axios.post(`${this.baseURL}/sendMessage`, payload);
      
      if (response.data.ok) {
        console.log('✅ Message sent to Telegram successfully');
        return true;
      } else {
        console.error('❌ Telegram API error:', response.data);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error.message);
      return false;
    }
  }

  // Send diary entry notification
  async sendDiaryEntry(entry, user) {
    const formattedDate = new Date(entry.createdAt).toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const moodEmoji = this.getMoodEmoji(entry.mood);
    
    const message = `
🌟 <b>Tâm sự mới từ Vườn Sao Băng</b> 🌟

👤 <b>Người viết:</b> ${user.displayName || user.username}
📅 <b>Thời gian:</b> ${formattedDate}

💭 <b>Nội dung:</b>
<i>"${entry.content}"</i>
    `.trim();

    return await this.sendMessage(message);
  }

  // Send user registration notification
  async sendUserRegistration(user) {
    const message = `
🎉 <b>Chào mừng công chúa mới!</b> 🎉

👸 <b>Tên:</b> ${user.displayName || user.username}
🆔 <b>Username:</b> ${user.username}
📅 <b>Tham gia:</b> ${new Date(user.createdAt).toLocaleString('vi-VN')}

${user.profile?.favoriteEmoji || '🌟'} <i>Một thành viên mới đã tham gia Vườn Sao Băng!</i>
    `.trim();

    return await this.sendMessage(message);
  }

  // Send login notification (optional)
  async sendLoginNotification(user) {
    const message = `
🔐 <b>Đăng nhập thành công</b>

👤 ${user.displayName || user.username} đã vào Vườn Sao Băng
🕐 ${new Date().toLocaleString('vi-VN')}
    `.trim();

    return await this.sendMessage(message);
  }

  // Get mood emoji
  getMoodEmoji(mood) {
    const moodEmojis = {
      'happy': '😊',
      'sad': '😢', 
      'angry': '😠',
      'excited': '🤩',
      'tired': '😴',
      'worried': '😰',
      'peaceful': '😌',
      'grateful': '🙏',
      'lonely': '😔',
      'hopeful': '🌈'
    };
    
    return moodEmojis[mood] || '💫';
  }
}

// Create singleton instance
const telegramService = new TelegramService();

export default telegramService;
