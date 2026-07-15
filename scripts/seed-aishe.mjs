/**
 * Seed AISHE institution data into MongoDB.
 *
 * Usage:
 *   1. Download the institution list from https://aishe.gov.in → Download Data → Institution List
 *   2. Save it as:  scripts/aishe_data.csv  (CSV format)
 *   3. Run:         node scripts/seed-aishe.mjs
 *
 * Expected CSV columns (case-insensitive, extra columns ignored):
 *   AISHE Code | Name of Institution | State | District | Type of Institution | Name of University | AICTE ID | Year of Establishment | Management | Ownership
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv   from 'dotenv';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env.local');
  process.exit(1);
}

// ── AISHERecord schema (inline, no Next.js imports) ───────────────────────────
const AISHERecordSchema = new mongoose.Schema({
  aisheCode:       { type: String, required: true, unique: true, trim: true, uppercase: true },
  institutionName: { type: String, required: true, trim: true },
  state:           { type: String, default: '' },
  district:        { type: String, default: '' },
  type:            { type: String, default: '' },
  university:      { type: String, default: '' },
  aicteId:         { type: String, default: '' },
  yearEstablished: { type: String, default: '' },
  managementType:  { type: String, default: '' },
  ownershipType:   { type: String, default: '' },
  isRegistered:    { type: Boolean, default: false },
}, { timestamps: true });

AISHERecordSchema.index({ aisheCode: 1 });
AISHERecordSchema.index({ institutionName: 'text' });

const AISHERecord = mongoose.models.AISHERecord ||
  mongoose.model('AISHERecord', AISHERecordSchema);

// ── CSV parser ────────────────────────────────────────────────────────────────
function parseCSV(filePath) {
  const raw  = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error('CSV is empty or has only a header.');

  // Normalize headers
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());

  const map = (keyword) => headers.findIndex(h => h.includes(keyword));

  const colAishe  = map('aishe');
  const colName   = map('name of institution');
  const colState  = map('state');
  const colDist   = map('district');
  const colType   = map('type');
  const colUniv   = map('university');
  const colAicte  = map('aicte');
  const colYear   = map('year');
  const colMgmt   = map('management');
  const colOwner  = map('ownership');

  if (colAishe === -1 || colName === -1) {
    throw new Error(
      `Could not find required columns.\nFound headers: ${headers.join(', ')}\n` +
      `Need at least: "AISHE Code" and "Name of Institution".`
    );
  }

  const get = (row, idx) => (idx >= 0 && row[idx] ? row[idx].replace(/^"|"$/g, '').trim() : '');

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    const code = get(row, colAishe).toUpperCase();
    const name = get(row, colName);
    if (!code || !name) continue;
    records.push({
      aisheCode:       code,
      institutionName: name,
      state:           get(row, colState),
      district:        get(row, colDist),
      type:            get(row, colType),
      university:      get(row, colUniv),
      aicteId:         get(row, colAicte),
      yearEstablished: get(row, colYear),
      managementType:  get(row, colMgmt),
      ownershipType:   get(row, colOwner),
    });
  }
  return records;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const csvPath = path.join(__dirname, 'aishe_data.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`\n❌  CSV file not found at: ${csvPath}`);
    console.error('   Please download the AISHE institution list from https://aishe.gov.in');
    console.error('   and save it as scripts/aishe_data.csv\n');
    process.exit(1);
  }

  console.log('📂  Parsing CSV…');
  const records = parseCSV(csvPath);
  console.log(`✅  Parsed ${records.length.toLocaleString()} records.`);

  console.log('🔌  Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅  Connected.\n');

  // Bulk upsert in batches of 500
  const BATCH = 500;
  let inserted = 0, updated = 0;

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const ops   = batch.map(r => ({
      updateOne: {
        filter: { aisheCode: r.aisheCode },
        update: { $set: r },
        upsert: true,
      },
    }));
    const res = await AISHERecord.bulkWrite(ops, { ordered: false });
    inserted += res.upsertedCount || 0;
    updated  += res.modifiedCount || 0;

    const pct = Math.round(((i + batch.length) / records.length) * 100);
    process.stdout.write(`\r   Progress: ${pct}%  (${i + batch.length}/${records.length})`);
  }

  console.log(`\n\n✅  Done!`);
  console.log(`   Inserted : ${inserted.toLocaleString()}`);
  console.log(`   Updated  : ${updated.toLocaleString()}`);
  console.log(`   Total    : ${records.length.toLocaleString()}\n`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
