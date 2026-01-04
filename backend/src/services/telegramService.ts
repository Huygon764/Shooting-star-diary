import axios from "axios";
import { env } from "../config/index.js";
import { formatDateVi } from "../utils/index.js";
import type { IUserDocument, IEntryDocument } from "../types/index.js";

interface SendMessageOptions {
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
}

class TelegramService {
  private readonly botToken: string | null;
  private readonly chatId: string | null;
  private readonly baseUrl: string | null;

  constructor() {
    this.botToken = env.telegramBotToken;
    this.chatId = env.telegramChatId;
    this.baseUrl = this.botToken
      ? `https://api.telegram.org/bot${this.botToken}`
      : null;
  }

  /**
   * Check if Telegram bot is configured
   */
  isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  /**
   * Send a simple text message
   */
  async sendMessage(
    text: string,
    options: SendMessageOptions = {}
  ): Promise<boolean> {
    if (!this.isConfigured() || !this.baseUrl) {
      console.warn(
        "❌ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env"
      );
      return false;
    }

    try {
      const payload = {
        chat_id: this.chatId,
        text,
        parse_mode: "HTML" as const,
        disable_web_page_preview: true,
        ...options,
      };

      const response = await axios.post(`${this.baseUrl}/sendMessage`, payload);

      if (response.data.ok) {
        console.log("✅ Message sent to Telegram successfully");
        return true;
      }

      console.error("❌ Telegram API error:", response.data);
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Error sending Telegram message:", errorMessage);
      return false;
    }
  }

  /**
   * Send diary entry notification
   */
  async sendDiaryEntry(
    entry: IEntryDocument,
    user: IUserDocument
  ): Promise<boolean> {
    const formattedDate = formatDateVi(new Date(entry.createdAt));

    const message = `
🌟 <b>Tâm sự mới từ Vườn Sao Băng</b> 🌟

👤 <b>Người viết:</b> ${user.displayName || user.username}
📅 <b>Thời gian:</b> ${formattedDate}

💭 <b>Nội dung:</b>
<i>"${entry.content}"</i>
    `.trim();

    return this.sendMessage(message);
  }

  /**
   * Send user registration notification
   */
  async sendUserRegistration(user: IUserDocument): Promise<boolean> {
    const formattedDate = formatDateVi(new Date(user.createdAt));

    const message = `
🎉 <b>Chào mừng công chúa!</b> 🎉

👸 <b>Tên:</b> ${user.displayName || user.username}
🆔 <b>Username:</b> ${user.username}
📅 <b>Tham gia:</b> ${formattedDate}

${
  user.profile?.favoriteEmoji || "🌟"
} <i>Một thành viên mới đã tham gia Vườn Sao Băng!</i>
    `.trim();

    return this.sendMessage(message);
  }

  /**
   * Send login notification
   */
  async sendLoginNotification(user: IUserDocument): Promise<boolean> {
    const formattedDate = formatDateVi(new Date());

    const message = `
🔐 <b>Đăng nhập thành công</b>

👤 ${user.displayName || user.username} đã vào Vườn Sao Băng
🕐 ${formattedDate}
    `.trim();

    return this.sendMessage(message);
  }
}

// Singleton instance
export const telegramService = new TelegramService();
