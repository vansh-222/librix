import mongoose from 'mongoose';

const AISHERecordSchema = new mongoose.Schema(
  {
    aisheCode:       { type: String, required: true, unique: true, trim: true, uppercase: true },
    institutionName: { type: String, required: true, trim: true },
    state:           { type: String, default: '' },
    district:        { type: String, default: '' },
    type:            { type: String, default: '' }, // College | University | Institution
    university:      { type: String, default: '' },
    aicteId:         { type: String, default: '' },
    yearEstablished: { type: String, default: '' },
    managementType:  { type: String, default: '' }, // Government | Private | Aided
    ownershipType:   { type: String, default: '' },
    isRegistered:    { type: Boolean, default: false }, // true once claimed on Librix
  },
  { timestamps: true }
);

AISHERecordSchema.index({ aisheCode: 1 });
AISHERecordSchema.index({ institutionName: 'text' });

export default mongoose.models.AISHERecord ||
  mongoose.model('AISHERecord', AISHERecordSchema);
