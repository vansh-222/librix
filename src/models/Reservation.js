import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    position: { type: Number, required: true }, // queue position
    status: {
      type: String,
      enum: ['waiting', 'notified', 'fulfilled', 'expired', 'cancelled'],
      default: 'waiting',
    },
    notifiedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null }, // 48h after notified
  },
  { timestamps: true }
);

ReservationSchema.index({ collegeId: 1, bookId: 1, status: 1 });
ReservationSchema.index({ userId: 1 });

export default mongoose.models.Reservation ||
  mongoose.model('Reservation', ReservationSchema);
