import type { Request, Response } from "express";
import { Entry } from "../models/index.js";
import { telegramService } from "../services/telegramService.js";
import { catchAsync, sendSuccess, badRequest } from "../utils/index.js";
import { MESSAGES } from "../constants/index.js";
import type { CreateEntryDto } from "../types/index.js";

/**
 * Create new entry
 * POST /api/entries
 * Requires: authenticate
 */
export const createEntry = catchAsync(async (req: Request, res: Response) => {
  const { content, isPrivate } = req.body as CreateEntryDto;

  if (!content?.trim()) {
    throw badRequest(MESSAGES.ENTRY.CONTENT_REQUIRED);
  }

  // Get userId from authenticated user
  const userId = req.user?.userId;

  const newEntry = new Entry({
    content: content.trim(),
    id: Date.now(),
    userId,
    ...(typeof isPrivate === "boolean" && { isPrivate }),
  });

  const savedEntry = await newEntry.save();

  // Populate user data
  await savedEntry.populate("userId", "username displayName avatar");

  // Send Telegram notification if entry is not private
  if (!savedEntry.isPrivate && req.userDoc) {
    telegramService
      .sendDiaryEntry(savedEntry, req.userDoc)
      .catch((err: any) => {
        console.error("Telegram notification failed:", err);
      });
  }

  sendSuccess(res, 201, savedEntry, MESSAGES.ENTRY.CREATED);
});
