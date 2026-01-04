import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import { env } from '../config/index.js';
import { User } from '../models/index.js';
import { formatDateVi } from '../utils/index.js';

class TelegramBot {
  private bot: Telegraf | null = null;
  private adminChatId: string | null;

  constructor() {
    this.adminChatId = env.telegramChatId;

    if (env.telegramBotToken) {
      this.bot = new Telegraf(env.telegramBotToken);
      this.setupCommands();
    }
  }

  /**
   * Check if sender is admin
   */
  private isAdmin(ctx: Context): boolean {
    const chatId = ctx.chat?.id.toString();
    return chatId === this.adminChatId;
  }

  /**
   * Setup bot commands
   */
  private setupCommands(): void {
    if (!this.bot) return;

    // /start command
    this.bot.start((ctx) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('⛔ Bạn không có quyền sử dụng bot này.');
      }
      return ctx.reply(
        '✨ Chào mừng đến với Vườn Sao Băng Bot! ✨\n\n' +
        'Commands:\n' +
        '/register <username> <password> - Tạo user mới\n' +
        '/remove <username> - Xóa user\n' +
        '/list - Xem danh sách users'
      );
    });

    // /help command
    this.bot.help((ctx) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('⛔ Bạn không có quyền sử dụng bot này.');
      }
      return ctx.reply(
        '📖 Hướng dẫn sử dụng:\n\n' +
        '/register <username> <password> - Tạo user mới\n' +
        '/remove <username> - Xóa user\n' +
        '/list - Xem danh sách users'
      );
    });

    // /register command
    this.bot.command('register', async (ctx) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('⛔ Bạn không có quyền sử dụng bot này.');
      }

      try {
        const text = ctx.message.text;
        const args = text.split(' ').slice(1);

        if (args.length < 2) {
          return ctx.reply('❌ Sử dụng: /register <username> <password>');
        }

        const [username, password] = args;

        // Validate username
        if (username.length < 3 || username.length > 30) {
          return ctx.reply('❌ Username phải từ 3-30 ký tự.');
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          return ctx.reply('❌ Username chỉ được chứa chữ cái, số và dấu gạch dưới.');
        }

        // Validate password
        if (password.length < 6) {
          return ctx.reply('❌ Password phải ít nhất 6 ký tự.');
        }

        // Check if user exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
          return ctx.reply(`❌ Username "${username}" đã tồn tại.`);
        }

        // Create user
        const newUser = new User({
          username,
          password,
          displayName: username,
        });

        await newUser.save();

        return ctx.reply(
          `✅ Tạo user thành công!\n\n` +
          `👤 Username: ${username}\n` +
          `🔑 Password: ${password}\n` +
          `📅 Ngày tạo: ${formatDateVi(new Date())}`
        );
      } catch (error) {
        console.error('Error registering user:', error);
        return ctx.reply('❌ Có lỗi xảy ra khi tạo user.');
      }
    });

    // /remove command
    this.bot.command('remove', async (ctx) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('⛔ Bạn không có quyền sử dụng bot này.');
      }

      try {
        const text = ctx.message.text;
        const args = text.split(' ').slice(1);

        if (args.length < 1) {
          return ctx.reply('❌ Sử dụng: /remove <username>');
        }

        const [username] = args;

        // Find user
        const user = await User.findByUsername(username);
        if (!user) {
          return ctx.reply(`❌ Không tìm thấy user "${username}".`);
        }

        // Delete user
        await User.findByIdAndDelete(user._id);

        return ctx.reply(`✅ Đã xóa user "${username}" thành công!`);
      } catch (error) {
        console.error('Error removing user:', error);
        return ctx.reply('❌ Có lỗi xảy ra khi xóa user.');
      }
    });

    // /list command
    this.bot.command('list', async (ctx) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('⛔ Bạn không có quyền sử dụng bot này.');
      }

      try {
        const users = await User.find({ isActive: true }).sort({ createdAt: -1 });

        if (users.length === 0) {
          return ctx.reply('📋 Chưa có user nào.');
        }

        const userList = users
          .map((user, index) => {
            const lastLogin = user.lastLogin
              ? formatDateVi(user.lastLogin)
              : 'Chưa đăng nhập';
            return `${index + 1}. ${user.username} (${user.displayName})\n   └ Đăng nhập: ${lastLogin}`;
          })
          .join('\n\n');

        return ctx.reply(`📋 Danh sách users (${users.length}):\n\n${userList}`);
      } catch (error) {
        console.error('Error listing users:', error);
        return ctx.reply('❌ Có lỗi xảy ra khi lấy danh sách users.');
      }
    });

    // Handle unknown commands
    this.bot.on(message('text'), (ctx) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('⛔ Bạn không có quyền sử dụng bot này.');
      }
      // Ignore non-command messages
    });
  }

  /**
   * Launch bot (polling or webhook)
   */
  async launch(): Promise<void> {
    if (!this.bot) {
      console.log('⚠️ Telegram bot not configured. Skipping...');
      return;
    }

    try {
      if (env.telegramWebhookDomain) {
        // Webhook mode
        await this.bot.launch({
          webhook: {
            domain: env.telegramWebhookDomain,
            port: env.port,
          },
        });
        console.log(`✅ Telegram bot started (webhook: ${env.telegramWebhookDomain})`);
      } else {
        // Polling mode
        await this.bot.launch();
        console.log('✅ Telegram bot started (polling)');
      }

      // Graceful shutdown
      process.once('SIGINT', () => this.bot?.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot?.stop('SIGTERM'));
    } catch (error) {
      console.error('❌ Failed to launch Telegram bot:', error);
    }
  }
}

// Singleton instance
export const telegramBot = new TelegramBot();

