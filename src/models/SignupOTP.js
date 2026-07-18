import mongoose from 'mongoose';

/**
 * Temporary OTP record for signup email verification.
 * Auto-deleted after expiry via TTL index.
 */
const SignupOTPSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true },
  otpHash:   { type: String, required: true },
  expiresAt: { type: Date,   required: true },
  role:      { type: String, enum: ['student', 'librarian'], required: true },
  // Everything needed to create the account after OTP is verified
  pendingData: {
    name:             { type: String, required: true },
    passwordHash:     { type: String, required: true },
    collegeId:        { type: mongoose.Schema.Types.ObjectId, default: null }, // student
    collegeName:      { type: String, default: '' },
    libraryCode:      { type: String, default: '' },
    verificationKeyId:{ type: mongoose.Schema.Types.ObjectId, default: null }, // librarian
  },
}, { timestamps: true });

// Auto-delete expired documents
SignupOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// One pending OTP per email at a time
SignupOTPSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.SignupOTP ||
  mongoose.model('SignupOTP', SignupOTPSchema);
