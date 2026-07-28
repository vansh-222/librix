'use client';
import { useState } from 'react';
import { X, BookOpen, Calendar, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const DAY_OPTIONS = [7, 14, 21, 30];

const REASON_PRESETS = [
  'Academic study / coursework',
  'Research & project work',
  'General reading / personal interest',
  'Exam preparation',
  'Reference & quick lookup',
];

export default function RequestModal({ book, onClose, onSuccess }) {
  const [daysNeeded, setDaysNeeded] = useState(14);
  const [customDays, setCustomDays] = useState('');
  const [useCustom, setUseCustom]   = useState(false);
  const [reason, setReason]         = useState('');
  const [customReason, setCustomReason] = useState('');
  const [useCustomReason, setUseCustomReason] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const effectiveDays   = useCustom ? parseInt(customDays) || 0 : daysNeeded;
  const effectiveReason = useCustomReason ? customReason : reason;

  const handleSubmit = async () => {
    if (effectiveDays < 1 || effectiveDays > 60) {
      setError('Please choose between 1 and 60 days.'); return;
    }
    if (!effectiveReason.trim()) {
      setError('Please provide a reason for your request.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/requests', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ bookId: book._id, daysNeeded: effectiveDays, reason: effectiveReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Request failed.'); return; }
      onSuccess?.(`Request sent for "${book.title}" — ${effectiveDays} days ✅`);
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter,sans-serif' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 480, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'modalIn 0.2s ease' }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(-10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div style={{ flexShrink: 0, background: 'linear-gradient(135deg,#1A73E8,#1A73E8)', padding: '22px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {book.cover
                ? <img src={book.cover} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                : <BookOpen size={22} color="white" />
              }
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Request Book</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white', lineHeight: 1.3, maxWidth: 280 }}>{book.title}</div>
              {book.author && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>by {book.author}</div>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, flexShrink: 0 }}>
            <X size={18} color="white" />
          </button>
        </div>

        <div style={{ padding: '24px 24px 16px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {/* ── Days Needed ── */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
              <Calendar size={15} color="#1A73E8" /> How many days do you need this book?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 10 }}>
              {DAY_OPTIONS.map(d => (
                <button key={d} onClick={() => { setDaysNeeded(d); setUseCustom(false); }}
                  style={{ padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: '2px solid',
                    borderColor: !useCustom && daysNeeded === d ? '#1A73E8' : '#E5E7EB',
                    background: !useCustom && daysNeeded === d ? '#EFF6FF' : 'white',
                    color: !useCustom && daysNeeded === d ? '#1A73E8' : '#6B7280',
                    transition: 'all 0.15s',
                  }}>
                  {d} days
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="number"
                min="1"
                max="60"
                placeholder="Custom (e.g. 45)"
                value={customDays}
                onFocus={() => setUseCustom(true)}
                onChange={e => { setCustomDays(e.target.value); setUseCustom(true); }}
                style={{ flex: 1, padding: '9px 12px', border: `2px solid ${useCustom ? '#1A73E8' : '#E5E7EB'}`, borderRadius: 10, fontSize: 13, color: '#111827', background: 'white', outline: 'none', fontFamily: 'Inter' }}
              />
              <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>max 60 days</span>
            </div>
          </div>

          {/* ── Reason ── */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
              <FileText size={15} color="#1A73E8" /> Reason for request
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
              {REASON_PRESETS.map(r => (
                <button key={r} onClick={() => { setReason(r); setUseCustomReason(false); }}
                  style={{ padding: '9px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left', border: '2px solid',
                    borderColor: !useCustomReason && reason === r ? '#1A73E8' : '#E5E7EB',
                    background: !useCustomReason && reason === r ? '#EFF6FF' : 'white',
                    color: !useCustomReason && reason === r ? '#1A73E8' : '#6B7280',
                    transition: 'all 0.15s',
                  }}>
                  {!useCustomReason && reason === r ? '✓ ' : ''}{r}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Or write your own reason..."
              value={customReason}
              onFocus={() => setUseCustomReason(true)}
              onChange={e => { setCustomReason(e.target.value); setUseCustomReason(true); }}
              rows={2}
              style={{ width: '100%', padding: '10px 12px', border: `2px solid ${useCustomReason ? '#1A73E8' : '#E5E7EB'}`, borderRadius: 10, fontSize: 13, color: '#111827', background: 'white', outline: 'none', fontFamily: 'Inter', resize: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FEF2F2', borderRadius: 10, marginBottom: 16, border: '1px solid #FECACA' }}>
              <AlertCircle size={14} color="#EF4444" />
              <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Summary pill */}
          {effectiveDays > 0 && effectiveReason.trim() && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>
                Requesting for {effectiveDays} day{effectiveDays > 1 ? 's' : ''} — {effectiveReason.length > 40 ? effectiveReason.slice(0, 40) + '…' : effectiveReason}
              </span>
            </div>
          )}
        </div>

        {/* Sticky Actions Footer */}
        <div style={{ padding: '16px 24px 24px', flexShrink: 0, borderTop: '1px solid #F3F4F6', background: 'white' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              style={{ flex: 2, padding: '12px', border: 'none', borderRadius: 12, background: loading ? '#93C5FD' : 'linear-gradient(135deg,#1A73E8,#1A73E8)', color: 'white', fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Sending...</> : <><CheckCircle2 size={16} /> Send Request</>}
            </button>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>

  );
}
