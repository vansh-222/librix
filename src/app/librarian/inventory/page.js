'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { Package, Search, Edit2, Save, X, BookOpen, Loader2 } from 'lucide-react';

export default function LibrarianInventoryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ total: 0, available: 0, shelf: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchBooks = () => {
    setLoading(true);
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    fetch(`/api/books${qs}`).then(r => r.json()).then(d => {
      setBooks(d.books || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    const t = setTimeout(fetchBooks, 300);
    return () => clearTimeout(t);
  }, [search]);

  const startEdit = (book) => {
    setEditingId(book._id);
    setEditForm({
      total: book.inventory?.total || 0,
      available: book.inventory?.available || 0,
      shelf: book.inventory?.shelf || '',
    });
  };

  const saveEdit = async (bookId) => {
    setSaving(true);
    const res = await fetch('/api/books', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId,
        total: Number(editForm.total),
        available: Number(editForm.available),
        shelf: editForm.shelf,
      }),
    });
    setSaving(false);
    if (res.ok) {
      showToast('Inventory updated!');
      setEditingId(null);
      fetchBooks();
    } else {
      showToast('Update failed');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="Inventory" subtitle="Manage book copies and shelf locations" />

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: 'var(--brand)', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 600,
        }}>{toast}</div>
      )}

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input
          className="input" placeholder="Search books..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 40, margin: 0 }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--brand)' }} />
        </div>
      ) : books.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <Package size={40} style={{ margin: '0 auto 12px', color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>No books found.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Total Copies</th>
                <th>Available</th>
                <th>Issued</th>
                <th>Shelf</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => {
                const total = book.inventory?.total || 0;
                const available = book.inventory?.available || 0;
                const issued = total - available;
                const isEditing = editingId === book._id;

                return (
                  <tr key={book._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--surface-2)' }}>
                          {book.cover
                            ? <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={14} color="var(--muted)" /></div>
                          }
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12, background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6 }}>{book.category || '—'}</span></td>

                    {/* Editable fields */}
                    <td>
                      {isEditing ? (
                        <input type="number" value={editForm.total} min={0}
                          onChange={e => setEditForm(f => ({ ...f, total: e.target.value }))}
                          style={{ width: 64, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 13 }} />
                      ) : total}
                    </td>
                    <td>
                      {isEditing ? (
                        <input type="number" value={editForm.available} min={0} max={editForm.total}
                          onChange={e => setEditForm(f => ({ ...f, available: e.target.value }))}
                          style={{ width: 64, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 13 }} />
                      ) : (
                        <span style={{ color: available === 0 ? '#EF4444' : '#22C55E', fontWeight: 700 }}>{available}</span>
                      )}
                    </td>
                    <td style={{ color: issued > 0 ? '#F59E0B' : 'var(--muted)' }}>{issued}</td>
                    <td>
                      {isEditing ? (
                        <input value={editForm.shelf}
                          onChange={e => setEditForm(f => ({ ...f, shelf: e.target.value }))}
                          style={{ width: 80, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 13 }}
                          placeholder="A-12" />
                      ) : (
                        <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{book.inventory?.shelf || '—'}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => saveEdit(book._id)} disabled={saving}
                            style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center', fontSize: 13 }}>
                            {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={12} />} Save
                          </button>
                          <button onClick={() => setEditingId(null)}
                            style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(book)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', gap: 4, alignItems: 'center', fontSize: 13 }}>
                          <Edit2 size={13} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
