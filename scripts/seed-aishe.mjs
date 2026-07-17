/**
 * Seed AISHE institution data into MongoDB.
 *
 * Usage:  node scripts/seed-aishe.mjs
 *
 * Handles the AISHE dashboard CSV format:
 *   - Title rows before the actual header are auto-skipped
 *   - Columns: Aishe Code, Name, State, District, Website,
 *              Year Of Establishment, Location, College Type,
 *              Manegement (sic), University Aishe Code, University Name, University Type
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv   from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env.local');
  process.exit(1);
}

// ── Schema ────────────────────────────────────────────────────────────────────
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

AISHERecordSchema.index({ institutionName: 'text' });

const AISHERecord = mongoose.models.AISHERecord ||
  mongoose.model('AISHERecord', AISHERecordSchema);

// ── CSV helpers ───────────────────────────────────────────────────────────────

/** Proper CSV splitter — handles quoted fields containing commas */
function splitCSVRow(line) {
  const result = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

/** Find first column whose header includes any of the given keywords */
function findCol(headers, ...keywords) {
  for (const kw of keywords) {
    const idx = headers.findIndex(h => h.includes(kw));
    if (idx !== -1) return idx;
  }
  return -1;
}

// ── CSV parser ────────────────────────────────────────────────────────────────
function parseCSV(filePath) {
  const raw   = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.replace(/^\uFEFF/, '').split(/\r?\n/); // strip BOM

  // ── Auto-detect the real header row ──────────────────────────────────────
  // Skip title/metadata rows (like "ALL COLLEGE" and timestamp) by finding
  // the first row that contains "aishe" in one of its cells.
  let headerLineIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const lower = lines[i].toLowerCase();
    if (lower.includes('aishe') && (lower.includes('code') || lower.includes('name'))) {
      headerLineIdx = i;
      break;
    }
  }

  if (headerLineIdx === -1) {
    throw new Error(
      'Could not find the header row in the first 10 lines.\n' +
      'Make sure the CSV contains columns like "Aishe Code" and "Name".'
    );
  }

  const headers = splitCSVRow(lines[headerLineIdx])
    .map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());

  console.log(`\n📋  Header found on line ${headerLineIdx + 1}, ${headers.length} columns:`);
  headers.forEach((h, i) => console.log(`    [${i}] ${h}`));
  console.log('');

  // Column detection — includes typo variants from the real AISHE export
  const colAishe = findCol(headers, 'aishe code', 'aishe');
  const colName  = findCol(headers, 'name of institution', 'college name', 'institution name', 'name');
  const colState = findCol(headers, 'state name', 'state');
  const colDist  = findCol(headers, 'district name', 'district');
  const colType  = findCol(headers, 'college type', 'type of institution', 'institution type');
  const colUniv  = findCol(headers, 'university name', 'name of university', 'affiliating university');
  const colAicte = findCol(headers, 'aicte id', 'aicte');
  const colYear  = findCol(headers, 'year of establishment', 'year established', 'established', 'year');
  // "Manegement" is a typo in the official AISHE CSV — handle both spellings
  const colMgmt  = findCol(headers, 'manegement', 'management type', 'management');
  const colOwner = findCol(headers, 'ownership type', 'ownership');

  if (colAishe === -1) throw new Error(`Could not find AISHE Code column. Headers: ${headers.join(' | ')}`);
  if (colName  === -1) throw new Error(`Could not find Name column. Headers: ${headers.join(' | ')}`);

  console.log(`  ✅ AISHE Code      → [${colAishe}] "${headers[colAishe]}"`);
  console.log(`  ✅ Name            → [${colName}]  "${headers[colName]}"`);
  if (colState > -1) console.log(`  ✅ State           → [${colState}]  "${headers[colState]}"`);
  if (colDist  > -1) console.log(`  ✅ District        → [${colDist}]  "${headers[colDist]}"`);
  if (colType  > -1) console.log(`  ✅ College Type    → [${colType}]  "${headers[colType]}"`);
  if (colUniv  > -1) console.log(`  ✅ University Name → [${colUniv}]  "${headers[colUniv]}"`);
  if (colYear  > -1) console.log(`  ✅ Year            → [${colYear}]  "${headers[colYear]}"`);
  if (colMgmt  > -1) console.log(`  ✅ Management      → [${colMgmt}]  "${headers[colMgmt]}"`);
  console.log('');

  const get = (row, idx) =>
    (idx >= 0 && row[idx] != null) ? row[idx].replace(/^"|"$/g, '').trim() : '';

  const records = [];
  for (let i = headerLineIdx + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row  = splitCSVRow(lines[i]);
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
    console.error(`\n❌  CSV file not found at: ${csvPath}\n`);
    process.exit(1);
  }

  console.log('📂  Parsing CSV…');
  const records = parseCSV(csvPath);
  console.log(`✅  Parsed ${records.length.toLocaleString()} records.\n`);

  if (records.length === 0) {
    console.error('❌  No records parsed — check CSV format.');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅  Connected.\n');

  // Clear ALL existing AISHE records (sample + old) before loading real data
  console.log('🗑️   Clearing existing AISHE records…');
  const deleted = await AISHERecord.deleteMany({});
  console.log(`✅  Cleared ${deleted.deletedCount.toLocaleString()} existing records.\n`);

  // Bulk insert in batches of 500
  const BATCH = 500;
  let inserted = 0, failed = 0;

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const ops   = batch.map(r => ({
      updateOne: {
        filter: { aisheCode: r.aisheCode },
        update: { $setOnInsert: r },
        upsert: true,
      },
    }));

    try {
      const res = await AISHERecord.bulkWrite(ops, { ordered: false });
      inserted += res.upsertedCount || 0;
    } catch (err) {
      failed += batch.length;
      console.error(`\n  ⚠️  Batch ${i}–${i + batch.length} error:`, err.message.slice(0, 120));
    }

    const pct = Math.round(((i + batch.length) / records.length) * 100);
    process.stdout.write(`\r   Progress: ${pct}%  (${Math.min(i + batch.length, records.length).toLocaleString()} / ${records.length.toLocaleString()})`);
  }

  console.log(`\n\n✅  Done!`);
  console.log(`   Inserted : ${inserted.toLocaleString()}`);
  console.log(`   Failed   : ${failed.toLocaleString()}`);
  console.log(`   Total    : ${records.length.toLocaleString()}\n`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
