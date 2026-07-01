import mongoose from 'mongoose';

// Per-college inventory record for a book
const CollegeBookSchema = new mongoose.Schema(
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
    total:     { type: Number, required: true, min: 0 },
    available: { type: Number, required: true, min: 0 },
    shelf:     { type: String, default: '' },   // shelf number / code
    section:   { type: String, default: '' },   // e.g. "Science", "Fiction"
    floor:     { type: String, default: '' },   // e.g. "Ground", "1st Floor"
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

CollegeBookSchema.index({ collegeId: 1, bookId: 1 }, { unique: true });

export default mongoose.models.CollegeBook ||
  mongoose.model('CollegeBook', CollegeBookSchema);

