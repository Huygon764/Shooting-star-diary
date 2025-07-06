import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import telegramService from '../services/telegramService.js';

const userController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { username, password, displayName } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Tên đăng nhập đã tồn tại'
        });
      }

      // Create new user
      const userData = {
        username,
        password
      };
      
      if (displayName) userData.displayName = displayName;

      const newUser = new User(userData);
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
      );

      res.status(201).json({
        success: true,
        message: 'Tài khoản đã được tạo thành công! 🌟',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', ')
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi tạo tài khoản'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin đăng nhập'
        });
      }

      // Find user and include password for comparison
      const user = await User.findOne({ username }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Thông tin đăng nhập không chính xác'
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa'
        });
      }

      // Update last login
      await user.updateLastLogin();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
      );

      // Remove password from response
      user.password = undefined;

      // Send Telegram notification for login
      try {
        await telegramService.sendLoginNotification(user);
      } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError);
        // Continue execution even if Telegram fails
      }

      res.json({
        success: true,
        message: 'Đăng nhập thành công! 🌟',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi đăng nhập'
      });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.userId; // From auth middleware
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin cá nhân'
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { displayName, profile, settings } = req.body;
      
      const updateData = {};
      if (displayName !== undefined) updateData.displayName = displayName;
      if (profile) updateData.profile = { ...updateData.profile, ...profile };
      if (settings) updateData.settings = { ...updateData.settings, ...settings };

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        message: 'Thông tin cá nhân đã được cập nhật',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật thông tin'
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ mật khẩu'
        });
      }

      // Find user with password
      const user = await User.findById(userId).select('+password');
      
      // Verify current password
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu hiện tại không chính xác'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Mật khẩu đã được thay đổi thành công'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi thay đổi mật khẩu'
      });
    }
  },

  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const skip = (page - 1) * limit;
      
      // Build search query
      const query = {};
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { displayName: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);
      
      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi lấy danh sách người dùng'
      });
    }
  },

  // Delete user account
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.userId;
      
      // Soft delete by setting isActive to false
      await User.findByIdAndUpdate(userId, { isActive: false });

      res.json({
        success: true,
        message: 'Tài khoản đã được xóa'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xóa tài khoản'
      });
    }
  }
};

export default userController;
