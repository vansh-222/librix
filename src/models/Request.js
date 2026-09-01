import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'issued', 'cancelled', 'returned'],
      default: 'requested',
    },
    note: { type: String, default: '' }, // librarian rejection note
    reason: { type: String, default: '' }, // student's stated reason for request
    daysNeeded: { type: Number, default: 14 }, // how many days student wants the book
    copyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookCopy',
      default: null,
    }, // physical copy assigned by librarian at approval
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

RequestSchema.index({ collegeId: 1, status: 1 });
RequestSchema.index({ userId: 1 });

delete mongoose.models.Request;
export default mongoose.model('Request', RequestSchema);
