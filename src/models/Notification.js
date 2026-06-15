import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      default: null,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'request_approved',
        'request_rejected',
        'book_issued',
        'return_reminder',
        'return_received',
        'fine_added',
        'reservation_available',
        'extension_approved',
        'extension_rejected',
        'overdue_alert',
        'general',
      ],
      default: 'general',
    },
    read: { type: Boolean, default: false },
    link: { type: String, default: '' }, // optional deep link
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1 });

export default mongoose.models.Notification ||
  mongoose.model('Notification', NotificationSchema);
