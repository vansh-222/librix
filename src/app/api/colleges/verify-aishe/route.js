import connectDB from '@/lib/db';
import AISHERecord from '@/models/AISHERecord';
import College from '@/models/College';
import { NextResponse } from 'next/server';

// ── Name normalization helpers ─────────────────────────────────────────────────

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fuzzyMatch(inputName, officialName) {
  if (!inputName) return { matched: true, confidence: 'skipped' };
  const input    = normalizeName(inputName);
  const official = normalizeName(officialName);

  if (input === official) return { matched: true, confidence: 'exact' };
  if (official.includes(input) || input.includes(official)) return { matched: true, confidence: 'high' };

  // Word-overlap scoring
  const inputWords    = new Set(input.split(' ').filter(w => w.length > 2));
  const officialWords = official.split(' ').filter(w => w.length > 2);
  const overlap       = officialWords.filter(w => inputWords.has(w)).length;
  const score         = overlap / Math.max(inputWords.size, officialWords.length);

  if (score >= 0.6) return { matched: true,  confidence: 'medium' };
  if (score >= 0.3) return { matched: false,  confidence: 'low'    };
  return              { matched: false,  confidence: 'none'   };
}

// ── GET /api/colleges/verify-aishe?code=C-27869&name=... ─────────────────────

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();
    const name = searchParams.get('name')?.trim() || '';

    if (!code) {
      return NextResponse.json({ error: 'AISHE code is required' }, { status: 400 });
    }

    await connectDB();

    const record = await AISHERecord.findOne({ aisheCode: code });
    if (!record) {
      return NextResponse.json(
        { found: false, error: 'AISHE code not found in our database. Please seed AISHE data first.' },
        { status: 404 }
      );
    }

    // Check if already claimed
    const alreadyRegistered = await College.findOne({
      aisheCode: code,
      verificationStatus: 'verified',
    });

    const nameMatch = fuzzyMatch(name, record.institutionName);

    return NextResponse.json({
      found:             true,
      matched:           nameMatch.matched,
      confidence:        nameMatch.confidence,
      alreadyRegistered: !!alreadyRegistered,
      record: {
        aisheCode:       record.aisheCode,
        institutionName: record.institutionName,
        state:           record.state,
        district:        record.district,
        type:            record.type,
        university:      record.university,
        aicteId:         record.aicteId,
        yearEstablished: record.yearEstablished,
        managementType:  record.managementType,
        ownershipType:   record.ownershipType,
      },
    });
  } catch (err) {
    console.error('[Verify AISHE GET]', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}

// ── POST /api/colleges/verify-aishe — search by institution name ──────────────

export async function POST(req) {
  try {
    const body  = await req.json();
    const query = body.query?.trim() || '';

    if (query.length < 3) {
      return NextResponse.json({ results: [] });
    }

    await connectDB();

    // Try text search first; fall back to regex if text index is missing
    let results = [];
    try {
      results = await AISHERecord
        .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(10)
        .lean();
    } catch {
      results = await AISHERecord
        .find({ institutionName: { $regex: query, $options: 'i' } })
        .limit(10)
        .lean();
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error('[Verify AISHE POST]', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
