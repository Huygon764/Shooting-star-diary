import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    default: Date.now
  },
  id: {
    type: Number,
    default: () => Date.now()
  },
  // Reference to user who created the entry (for future use)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Privacy setting
  isPrivate: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  // Add index for better query performance
  indexes: [
    { createdAt: -1 },
    { userId: 1 }
  ]
});

// Add instance methods
entrySchema.methods.toJSON = function() {
  const entry = this.toObject();
  // Remove sensitive data if needed
  return entry;
};

// Add static methods
entrySchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
