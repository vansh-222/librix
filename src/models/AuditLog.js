import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
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
    action: { type: String, required: true }, // e.g. 'BOOK_ISSUED', 'USER_SUSPENDED'
    entity: { type: String, default: '' },    // e.g. 'BorrowRecord', 'User'
    entityId: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

AuditLogSchema.index({ collegeId: 1, createdAt: -1 });
AuditLogSchema.index({ userId: 1 });

export default mongoose.models.AuditLog ||
  mongoose.model('AuditLog', AuditLogSchema);
