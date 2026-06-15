/**
 * Librarium Seed Script
 * Creates the Super Admin user + one demo college with librarian, student, and sample books
 * 
 * Usage: node scripts/seed.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// ─── Schemas (inline for seed script) ────────────────────────────────────────

const CollegeSchema = new mongoose.Schema({
  name: String, email: String, phone: String, address: String,
  plan: { type: String, default: 'basic' },
  status: { type: String, default: 'active' },
  settings: {
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    maxBorrowDays: { type: Number, default: 14 },
    finePerDay: { type: Number, default: 5 },
    maxExtensions: { type: Number, default: 2 },
    maxBooksPerUser: { type: Number, default: 3 },
    allowStudentRegistration: { type: Boolean, default: true },
  },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, default: null },
  name: String, email: String, passwordHash: String,
  role: String, studentId: String, rollNumber: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });
UserSchema.index({ email: 1, collegeId: 1 }, { unique: true });

const BookSchema = new mongoose.Schema({
  title: String, author: String, isbn: String, publisher: String,
  publishedYear: String, cover: String, description: String,
  category: String, language: { type: String, default: 'English' },
  pages: Number, source: { type: String, default: 'manual' },
}, { timestamps: true });

const CollegeBookSchema = new mongoose.Schema({
  collegeId: mongoose.Schema.Types.ObjectId,
  bookId: mongoose.Schema.Types.ObjectId,
  total: Number, available: Number, shelf: String,
}, { timestamps: true });

const College = mongoose.models.College || mongoose.model('College', CollegeSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);
const CollegeBook = mongoose.models.CollegeBook || mongoose.model('CollegeBook', CollegeBookSchema);

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SAMPLE_BOOKS = [
  { title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', publisher: 'Avery', category: 'Self-Help', cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg', description: 'Tiny Changes, Remarkable Results. A practical guide to building good habits.', pages: 320 },
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', publisher: 'Prentice Hall', category: 'Technology', cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg', description: 'A Handbook of Agile Software Craftsmanship.', pages: 431 },
  { title: 'The Lean Startup', author: 'Eric Ries', isbn: '9780307887894', publisher: 'Crown Business', category: 'Business', cover: 'https://covers.openlibrary.org/b/isbn/9780307887894-M.jpg', description: 'How constant innovation creates radically successful businesses.', pages: 336 },
  { title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', isbn: '9780262033848', publisher: 'MIT Press', category: 'Technology', cover: 'https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg', description: 'The comprehensive textbook on algorithms.', pages: 1312 },
  { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', publisher: 'Harper', category: 'History', cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg', description: 'A Brief History of Humankind.', pages: 443 },
  { title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '9780857197689', publisher: 'Harriman House', category: 'Finance', cover: 'https://covers.openlibrary.org/b/isbn/9780857197689-M.jpg', description: 'Timeless lessons on wealth, greed, and happiness.', pages: 256 },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  // ── 1. Super Admin ──────────────────────────────────────────────────────────
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@librarium.app';
  const adminPass = 'Admin@1234';

  const existingAdmin = await User.findOne({ email: adminEmail, role: 'super_admin' });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPass, 12);
    await User.create({ name: 'Super Admin', email: adminEmail, passwordHash, role: 'super_admin', collegeId: null });
    console.log(`✅ Super Admin created`);
    console.log(`   Email   : ${adminEmail}`);
    console.log(`   Password: ${adminPass}\n`);
  } else {
    console.log(`ℹ️  Super Admin already exists\n`);
  }

  // ── 2. Demo College ─────────────────────────────────────────────────────────
  let college = await College.findOne({ email: 'demo@apexcollege.edu' });
  if (!college) {
    college = await College.create({
      name: 'Apex College of Engineering',
      email: 'demo@apexcollege.edu',
      phone: '+91 98765 43210',
      address: '123 Tech Avenue, Bengaluru, Karnataka - 560001',
      plan: 'basic',
      status: 'active',
      settings: { currency: 'INR', currencySymbol: '₹', maxBorrowDays: 14, finePerDay: 5, maxExtensions: 2, maxBooksPerUser: 3, allowStudentRegistration: true },
    });
    console.log(`✅ Demo College created: ${college.name}`);
  } else {
    console.log(`ℹ️  Demo College already exists`);
  }

  // ── 3. Librarian ────────────────────────────────────────────────────────────
  const libEmail = 'librarian@apexcollege.edu';
  const libPass = 'Lib@1234';
  const existingLib = await User.findOne({ email: libEmail, collegeId: college._id });
  if (!existingLib) {
    const passwordHash = await bcrypt.hash(libPass, 12);
    await User.create({ collegeId: college._id, name: 'Priya Sharma', email: libEmail, passwordHash, role: 'librarian', isActive: true });
    console.log(`✅ Librarian created`);
    console.log(`   Email   : ${libEmail}`);
    console.log(`   Password: ${libPass}`);
  } else {
    console.log(`ℹ️  Librarian already exists`);
  }

  // ── 4. Demo Student ─────────────────────────────────────────────────────────
  const stuEmail = 'student@apexcollege.edu';
  const stuPass = 'Student@1234';
  const existingStu = await User.findOne({ email: stuEmail, collegeId: college._id });
  if (!existingStu) {
    const passwordHash = await bcrypt.hash(stuPass, 12);
    await User.create({ collegeId: college._id, name: 'Vansh Patel', email: stuEmail, passwordHash, role: 'student', studentId: 'STU2024001', rollNumber: 'CS-101', department: 'Computer Science', isActive: true });
    console.log(`✅ Student created`);
    console.log(`   Email   : ${stuEmail}`);
    console.log(`   Password: ${stuPass}`);
  } else {
    console.log(`ℹ️  Student already exists`);
  }

  // ── 5. Sample Books ─────────────────────────────────────────────────────────
  console.log('\n📚 Adding sample books...');
  for (const bookData of SAMPLE_BOOKS) {
    let book = await Book.findOne({ isbn: bookData.isbn });
    if (!book) book = await Book.create({ ...bookData, source: 'manual', language: 'English' });

    const existing = await CollegeBook.findOne({ collegeId: college._id, bookId: book._id });
    if (!existing) {
      await CollegeBook.create({ collegeId: college._id, bookId: book._id, total: 5, available: 5, shelf: `${bookData.category[0]}-${Math.floor(Math.random() * 20 + 1)}` });
      console.log(`   ✅ ${bookData.title}`);
    } else {
      console.log(`   ℹ️  ${bookData.title} already in inventory`);
    }
  }

  console.log('\n🎉 Seed completed!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 LOGIN CREDENTIALS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Super Admin  : admin@librarium.app / Admin@1234`);
  console.log(`Librarian    : librarian@apexcollege.edu / Lib@1234`);
  console.log(`Student      : student@apexcollege.edu / Student@1234`);
  console.log(`College      : Apex College of Engineering`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
