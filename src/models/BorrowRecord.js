import mongoose from 'mongoose';

const BorrowRecordSchema = new mongoose.Schema(
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
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
    },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    extensionsUsed: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    fineStatus: {
      type: String,
      enum: ['none', 'pending', 'waived', 'paid'],
      default: 'none',
    },
    condition: {
      type: String,
      enum: ['good', 'damaged', 'lost'],
      default: 'good',
    },
    status: {
      type: String,
      enum: ['issued', 'return_pending', 'returned', 'overdue', 'lost'],
      default: 'issued',
    },
    // Which physical copy (accession number) was issued — optional
    copyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookCopy',
      default: null,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // student book rating (1-5)
    reviewNote: { type: String, default: '' }, // optional review text
    finePaidAt: { type: Date, default: null },  // when fine was paid
    upiTxnId:   { type: String, default: '' },  // UPI transaction ID from student
  },
  { timestamps: true }
);

BorrowRecordSchema.index({ collegeId: 1, status: 1 });
BorrowRecordSchema.index({ userId: 1 });
BorrowRecordSchema.index({ dueDate: 1, status: 1 });

// Force re-registration so schema changes (e.g. new fields) are always picked up
delete mongoose.models.BorrowRecord;
export default mongoose.model('BorrowRecord', BorrowRecordSchema);
