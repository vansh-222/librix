/**
 * Deletes ALL users (librarian + student) from the database.
 * Run once to start fresh with the new college registration flow.
 *   node scripts/clear-users.mjs
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.local') });

const UserSchema = new mongoose.Schema({
  name: String, email: String, role: String, collegeId: String,
}, { timestamps: true });

const User = mongoose.models?.User || mongoose.model('User', UserSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB\n');

  const count = await User.countDocuments();
  console.log(`Found ${count} user(s) in database.\n`);

  if (count === 0) {
    console.log('Nothing to delete.');
    await mongoose.disconnect();
    return;
  }

  // Show what will be deleted
  const users = await User.find({}).select('name email role');
  users.forEach(u => console.log(`  ❌  ${u.role.padEnd(10)} ${u.email}  (${u.name})`));

  const result = await User.deleteMany({});
  console.log(`\n🗑️   Deleted ${result.deletedCount} user(s).`);
  console.log('\n✅  Done. Register a new college at http://localhost:3000/register');

  await mongoose.disconnect();
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
