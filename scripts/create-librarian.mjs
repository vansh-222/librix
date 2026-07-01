/**
 * Create or fix a librarian account, linked to a college by its College Code.
 *
 * Usage:
 *   node scripts/create-librarian.mjs
 *
 * Edit the constants below before running.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.local') });

// ── Change these ──────────────────────────────────────────────────────────────
const COLLEGE_CODE       = '';              // e.g. 'ABC2026LIB001'  — leave blank to use first college in DB
const LIBRARIAN_EMAIL    = 'librarian@college.edu';
const LIBRARIAN_PASSWORD = 'Librarian@123';
const LIBRARIAN_NAME     = 'Head Librarian';
// ─────────────────────────────────────────────────────────────────────────────

const CollegeSchema = new mongoose.Schema({
  name:        String,
  collegeCode: String,
  email:       String,
  status:      String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  collegeId:    { type: mongoose.Schema.Types.ObjectId, ref: 'College', default: null },
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  passwordHash: { type: String, required: true, select: false },
  role:         { type: String, enum: ['student','teacher','librarian','super_admin'], default: 'student' },
  isActive:     { type: Boolean, default: true },
  lastLogin:    { type: Date },
}, { timestamps: true });

const College = mongoose.models?.College || mongoose.model('College', CollegeSchema);
const User    = mongoose.models?.User    || mongoose.model('User', UserSchema);

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('❌  MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB\n');

  // ── Find college ────────────────────────────────────────────────────────────
  let college;
  if (COLLEGE_CODE.trim()) {
    college = await College.findOne({ collegeCode: COLLEGE_CODE.trim().toUpperCase() });
    if (!college) {
      console.error(`❌  No college found with code: ${COLLEGE_CODE}`);
      console.error('    Run the app and register a college at /register first.');
      await mongoose.disconnect();
      process.exit(1);
    }
  } else {
    college = await College.findOne({}).sort({ createdAt: 1 });
    if (!college) {
      console.error('❌  No colleges found in database.');
      console.error('    Register a college at http://localhost:3000/register first.');
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`ℹ️   No COLLEGE_CODE set — using first college: "${college.name}" (${college.collegeCode || 'no code'})`);
  }

  console.log(`📚  College: ${college.name}  (ID: ${college._id})`);

  // ── Check if librarian already exists ───────────────────────────────────────
  const existing = await User.findOne({ email: LIBRARIAN_EMAIL.toLowerCase() }).select('+passwordHash');

  if (existing) {
    console.log(`⚠️   User already exists: ${LIBRARIAN_EMAIL}  (role: ${existing.role})`);

    if (!existing.collegeId || existing.collegeId.toString() !== college._id.toString()) {
      existing.collegeId = college._id;
      existing.role      = 'librarian';
      await existing.save();
      console.log(`✅  Fixed: linked librarian to college "${college.name}"`);
    } else {
      console.log(`✅  Already linked to correct college.`);
    }
  } else {
    // Create new librarian
    const passwordHash = await bcrypt.hash(LIBRARIAN_PASSWORD, 12);
    await User.create({
      collegeId:    college._id,
      name:         LIBRARIAN_NAME,
      email:        LIBRARIAN_EMAIL.toLowerCase(),
      passwordHash,
      role:         'librarian',
      isActive:     true,
    });
    console.log('\n🎉  Librarian account created!');
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  College    : ${college.name}`);
  if (college.collegeCode) console.log(`  College ID : ${college.collegeCode}`);
  console.log(`  Email      : ${LIBRARIAN_EMAIL}`);
  console.log(`  Password   : ${LIBRARIAN_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('👉  Login at http://localhost:3000/login');
  console.log('    ⚠️  You MUST log out and log back in if you were already logged in.');
  console.log('');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
