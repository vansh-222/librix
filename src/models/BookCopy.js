import mongoose from 'mongoose';

// One document per physical book copy — holds the college-assigned accession number
const BookCopySchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    // The college-assigned accession / catalog number (e.g. "134", "A-136")
    // Optional — may be left empty if librarian doesn't assign one
    accessionNo: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['available', 'issued', 'lost'],
      default: 'available',
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

BookCopySchema.index({ collegeId: 1, bookId: 1 });
BookCopySchema.index({ collegeId: 1, status: 1 });

export default mongoose.models.BookCopy ||
  mongoose.model('BookCopy', BookCopySchema);
