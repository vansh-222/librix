/**
 * Run once to create the librarian account:
 *   node scripts/create-librarian.mjs
 *
 * Change LIBRARIAN_EMAIL and LIBRARIAN_PASSWORD below before running.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.local') });

// ── Change these ──────────────────────────────────────────────
const LIBRARIAN_EMAIL    = 'librarian@college.edu';
const LIBRARIAN_PASSWORD = 'Librarian@123';
const LIBRARIAN_NAME     = 'Head Librarian';
// ─────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  collegeId:    { type: String, default: 'default' },
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  role:         { type: String, enum: ['student','teacher','librarian','super_admin'], default: 'student' },
  isActive:     { type: Boolean, default: true },
  lastLogin:    { type: Date },
}, { timestamps: true });

const User = mongoose.models?.User || mongoose.model('User', UserSchema);

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('❌  MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  // Check if already exists
  const existing = await User.findOne({ email: LIBRARIAN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`⚠️   User already exists: ${LIBRARIAN_EMAIL}  (role: ${existing.role})`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(LIBRARIAN_PASSWORD, 12);

  await User.create({
    collegeId:    'default',
    name:         LIBRARIAN_NAME,
    email:        LIBRARIAN_EMAIL.toLowerCase(),
    passwordHash,
    role:         'librarian',
    isActive:     true,
  });

  console.log('');
  console.log('🎉  Librarian account created!');
  console.log('    Email   :', LIBRARIAN_EMAIL);
  console.log('    Password:', LIBRARIAN_PASSWORD);
  console.log('    Role    : librarian');
  console.log('');
  console.log('👉  Login at http://localhost:3000/login  →  Librarian Login tab');
  console.log('    Access Code: LIB-2024-SECURE  (set in .env.local)');
  console.log('');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
