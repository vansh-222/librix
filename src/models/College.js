import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending',
    },
    subscription: {
      startDate: Date,
      expiryDate: Date,
      status: {
        type: String,
        enum: ['trial', 'active', 'expired', 'cancelled'],
        default: 'trial',
      },
    },
    settings: {
      currency: { type: String, default: 'INR' },
      currencySymbol: { type: String, default: '₹' },
      maxBorrowDays: { type: Number, default: 14 },
      finePerDay: { type: Number, default: 5 },
      maxExtensions: { type: Number, default: 2 },
      maxBooksPerUser: { type: Number, default: 3 },
      allowStudentRegistration: { type: Boolean, default: true },
    },
    logoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.College || mongoose.model('College', CollegeSchema);
