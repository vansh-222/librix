import mongoose from 'mongoose';

const VerificationKeySchema = new mongoose.Schema(
  {
    collegeId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'College',
      required: true,
    },
    keyHash: {
      type:     String,
      required: true,
    },
    used:      { type: Boolean, default: false },
    expiresAt: { type: Date,    required: true },
  },
  { timestamps: true }
);

VerificationKeySchema.index({ collegeId: 1 });
VerificationKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired

export default mongoose.models.VerificationKey ||
  mongoose.model('VerificationKey', VerificationKeySchema);
