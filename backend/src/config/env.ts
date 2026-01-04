import dotenv from "dotenv";

dotenv.config();

interface Env {
  // Server
  port: number;
  nodeEnv: "development" | "production" | "test";

  // Database
  mongodbUri: string;

  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;

  // CORS
  frontendUrl: string;

  // Security
  bcryptRounds: number;

  // Telegram (optional)
  telegramBotToken: string | null;
  telegramChatId: string | null;
  telegramWebhookDomain: string | null;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string): string | null {
  return process.env[key] || null;
}

export const env: Env = {
  // Server
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: (process.env.NODE_ENV as Env["nodeEnv"]) || "development",

  // Database
  mongodbUri: requireEnv("MONGODB_URI"),

  // JWT
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",

  // CORS
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),

  // Telegram (optional)
  telegramBotToken: optionalEnv("TELEGRAM_BOT_TOKEN"),
  telegramChatId: optionalEnv("TELEGRAM_CHAT_ID"),
  telegramWebhookDomain: optionalEnv("TELEGRAM_WEBHOOK_DOMAIN"),
};
