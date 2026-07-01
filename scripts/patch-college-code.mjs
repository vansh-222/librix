/**
 * One-time patch: gives existing colleges a collegeCode if they don't have one.
 *   node scripts/patch-college-code.mjs
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.local') });

const CollegeSchema = new mongoose.Schema({
  name:        String,
  collegeCode: String,
  email:       String,
  status:      String,
}, { timestamps: true });

const College = mongoose.models?.College || mongoose.model('College', CollegeSchema);

function makeCode(name, seq) {
  const initials = name
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() || '')
    .filter(Boolean)
    .slice(0, 4)
    .join('') || 'CLG';
  return `${initials}2026LIB${String(seq).padStart(3,'0')}`;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected\n');

  const colleges = await College.find({});
  let seq = 1;
  for (const c of colleges) {
    if (!c.collegeCode) {
      const code = makeCode(c.name, seq++);
      c.collegeCode = code;
      c.status      = 'active';
      await c.save();
      console.log(`✅  Patched: "${c.name}"  →  ${code}`);
    } else {
      console.log(`⏭️   Already has code: "${c.name}"  →  ${c.collegeCode}`);
    }
  }

  console.log('\nDone! Students can now sign up using their College Library ID.');
  await mongoose.disconnect();
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
