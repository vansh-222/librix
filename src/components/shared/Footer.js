'use client';
import Link from 'next/link';

const BLUE = '#1A73E8';
const DARK = '#052033';

export default function Footer() {
  return (
    <footer style={{ background: DARK }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '60px 70px 4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 44, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
            </div>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 400, fontFamily: 'Inter', lineHeight: 1.6, marginBottom: 12 }}>Empowering smarter libraries worldwide</p>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 400, fontFamily: 'Inter', marginBottom: 16 }}>Info@librix.app</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
              
              {/* Facebook */}
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              {/* Instagram */}
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Solutions', 'Pricing'] },
            { title: 'Platform', links: ['Student Portal', 'Librarian Dashboard', 'Book Management'] },
            { title: 'Resources', links: ['Help Center', 'FAQs', 'Contact Support'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Privacy Policy', 'Terms & Conditions'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 4, height: 20, background: BLUE, borderRadius: 11 }} />
                <div style={{ color: 'white', fontSize: 20, fontWeight: 500, fontFamily: 'Inter' }}>{col.title}</div>
              </div>
              {col.links.map(l => (
                <div key={l} style={{ color: 'rgba(255,255,255,0.53)', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', marginBottom: 12, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: DARK, padding: '24px 24px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <h4 style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'Inter', margin: 0 }}>Payment Methods Accepted</h4>
          <div style={{ display: 'flex', gap: 12 }}>
              {/* Mastercard, Maestro, PayPal */}
              {[
                { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', alt: 'Mastercard' },
                { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Maestro_logo.svg', alt: 'Maestro' },
                { src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', alt: 'PayPal' },
              ].map((card, idx) => (
                <div key={idx} style={{ width: 42, height: 26, background: 'white', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
                  <img src={card.src} alt={card.alt} style={{ width: '100%', height: 'auto', maxHeight: 16, objectFit: 'contain' }} />
                </div>
              ))}
            </div>
        </div>
        <div style={{ width: '100%', maxWidth: 1200, height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 20 }} />
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}>© 2026 Librix. All rights reserved.</div>
      </div>
    </footer>
  );
}
