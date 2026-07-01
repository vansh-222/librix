import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema(
  {
    // Core identity
    name:       { type: String, required: true, trim: true },
    university: { type: String, required: true, trim: true },
    website:    { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailDomain:{ type: String, required: true, lowercase: true }, // extracted from email
    siteDomain: { type: String, required: true, lowercase: true }, // extracted from website

    // Verification
    domainVerified: { type: Boolean, default: false },
    emailVerified:  { type: Boolean, default: false },
    verificationStatus: {
      type:    String,
      enum:    ['pending', 'verified', 'rejected'],
      default: 'pending',
    },

    // OTP (stored temporarily until email verified)
    otpHash:      { type: String, select: false },
    otpExpiresAt: { type: Date },

    // Generated after verification
    institutionKey: { type: String, default: '', sparse: true }, // ABGI-LIB-7X92KQ
    libraryCode:    { type: String, default: '', sparse: true }, // LIB-ABGI-00001 (for students)
    collegeCode:    { type: String, default: '', sparse: true }, // backward compat

    // Librarian setup key reference
    setupKeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'VerificationKey', default: null },

    // Status & settings
    status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
    plan:   { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    settings: {
      currency:                { type: String,  default: 'INR' },
      currencySymbol:          { type: String,  default: '₹'   },
      maxBorrowDays:           { type: Number,  default: 14    },
      finePerDay:              { type: Number,  default: 5     },
      maxExtensions:           { type: Number,  default: 2     },
      maxBooksPerUser:         { type: Number,  default: 3     },
      allowStudentRegistration:{ type: Boolean, default: true  },
    },
    logoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

CollegeSchema.index({ institutionKey: 1 });
CollegeSchema.index({ libraryCode: 1 });
CollegeSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.College || mongoose.model('College', CollegeSchema);
