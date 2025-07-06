import { Entry } from '../models/index.js';
import telegramService from '../services/telegramService.js';

const entryController = {
  // Get all entries
  getAllEntries: async (req, res) => {
    try {
      const { userId, mood, limit = 50, page = 1 } = req.query;
      
      // Build query object
      const query = {};
      if (userId) query.userId = userId;
      if (mood) query.mood = mood;
      
      // Calculate skip for pagination
      const skip = (page - 1) * limit;
      
      const entries = await Entry.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .populate('userId', 'username displayName avatar');
      
      const total = await Entry.countDocuments(query);
      
      res.json({
        success: true,
        data: entries,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching entries:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lấy dữ liệu'
      });
    }
  },

  // Create new entry
  createEntry: async (req, res) => {
    try {
      const { content, mood, isPrivate, userId } = req.body;
      
      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Nội dung không được để trống'
        });
      }

      const entryData = {
        content: content.trim(),
        id: Date.now()
      };

      // Add optional fields if provided
      if (mood) entryData.mood = mood;
      if (typeof isPrivate === 'boolean') entryData.isPrivate = isPrivate;
      if (userId) entryData.userId = userId;

      const newEntry = new Entry(entryData);
      const savedEntry = await newEntry.save();
      
      // Populate user data if userId exists
      await savedEntry.populate('userId', 'username displayName avatar');
      
      // Send Telegram notification if user exists and entry is not private
      if (savedEntry.userId) {
        try {
          await telegramService.sendDiaryEntry(savedEntry, savedEntry.userId);
        } catch (telegramError) {
          console.error('Telegram notification failed:', telegramError);
          // Continue execution even if Telegram fails
        }
      }
      
      res.status(201).json({
        success: true,
        message: 'Tâm sự đã được gửi lên những vì sao! ✨',
        data: savedEntry
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lưu tâm sự'
      });
    }
  },

  // Get entry by ID
  getEntryById: async (req, res) => {
    try {
      const entry = await Entry.findById(req.params.id)
        .populate('userId', 'username displayName avatar');
      
      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tâm sự này'
        });
      }

      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lấy tâm sự'
      });
    }
  },

  // Update entry
  updateEntry: async (req, res) => {
    try {
      const { content, mood, isPrivate } = req.body;
      const updateData = {};

      if (content !== undefined) updateData.content = content.trim();
      if (mood !== undefined) updateData.mood = mood;
      if (typeof isPrivate === 'boolean') updateData.isPrivate = isPrivate;

      const updatedEntry = await Entry.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('userId', 'username displayName avatar');
      
      if (!updatedEntry) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tâm sự này'
        });
      }

      res.json({
        success: true,
        message: 'Tâm sự đã được cập nhật',
        data: updatedEntry
      });
    } catch (error) {
      console.error('Error updating entry:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật tâm sự'
      });
    }
  },

  // Delete entry
  deleteEntry: async (req, res) => {
    try {
      const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
      
      if (!deletedEntry) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tâm sự này'
        });
      }

      res.json({
        success: true,
        message: 'Tâm sự đã được xóa'
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xóa tâm sự'
      });
    }
  },

  // Get entries by user
  getEntriesByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 20, page = 1 } = req.query;
      
      const skip = (page - 1) * limit;
      
      const entries = await Entry.findByUserId(userId)
        .limit(parseInt(limit))
        .skip(skip)
        .populate('userId', 'username displayName avatar');
      
      const total = await Entry.countDocuments({ userId });
      
      res.json({
        success: true,
        data: entries,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching user entries:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lấy tâm sự của người dùng'
      });
    }
  }
};

export default entryController;
