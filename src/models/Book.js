import mongoose from 'mongoose';

// Global book catalog — shared across all colleges
const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, default: '', trim: true },
    publisher: { type: String, default: '' },
    publishedYear: { type: String, default: '' },
    cover: { type: String, default: '' }, // URL
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    language: { type: String, default: 'English' },
    pages: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ['manual', 'google_books', 'open_library'],
      default: 'manual',
    },
    googleBooksId: { type: String, default: '' },
    openLibraryId: { type: String, default: '' },
  },
  { timestamps: true }
);

BookSchema.index({ title: 'text', author: 'text', isbn: 'text' });

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
