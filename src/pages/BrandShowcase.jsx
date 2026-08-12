import React, { useState } from 'react';

export default function BrandShowcase() {
  const [copiedHex, setCopiedHex] = useState(null);
  const [activeBg, setActiveBg] = useState('transparent'); // 'white' | 'transparent' | 'light'

  const darkTextColors = [
    { name: 'Obsidian Black (Text)', hex: '#0B0B0C', rgb: 'rgb(11, 11, 12)', pantone: 'Process Black C', usage: 'Primary ultra-thick letterform color' },
    { name: 'Pure White (Background)', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', pantone: 'White', usage: 'High-contrast print & white background' },
    { name: 'Transparent (PNG/SVG)', hex: 'TRANSPARENT', rgb: 'alpha(0)', pantone: 'N/A', usage: 'Web headers, video overlays, product watermarks' },
    { name: 'Slate Dark (Subtle Accent)', hex: '#334155', rgb: 'rgb(51, 65, 85)', pantone: 'Cool Gray 11 C', usage: 'Secondary text & border outline' },
  ];

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const getContainerBgStyle = () => {
    if (activeBg === 'white') return { background: '#FFFFFF' };
    if (activeBg === 'light') return { background: '#F8FAFC' };
    return {
      backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 0)',
      backgroundSize: '16px 16px',
      backgroundColor: '#F1F5F9'
    };
  };

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A', minHeight: '100vh', padding: '3rem 1.5rem', fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            background: '#0F172A', 
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            padding: '8px 24px',
            borderRadius: '30px',
            display: 'inline-block'
          }}>
            WHITE & TRANSPARENT BACKGROUND SPECIFICATION
          </span>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 900, margin: '1.25rem 0 0.75rem', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Viyona Designs
          </h1>
          <p style={{ color: '#475569', fontSize: '1.15rem', maxWidth: '750px', margin: '0 auto', lineHeight: 1.7 }}>
            An ultra-thick, muscular single-line wordmark in deep obsidian black (`#0B0B0C`) presented on clean white and true transparent vector backgrounds. Optimized for trademark filing & versatile branding.
          </p>

          {/* Background Toggle Buttons */}
          <div style={{ display: 'inline-flex', gap: '0.5rem', background: '#E2E8F0', padding: '6px', borderRadius: '14px', marginTop: '1.75rem' }}>
            <button 
              onClick={() => setActiveBg('transparent')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeBg === 'transparent' ? '#0F172A' : 'transparent',
                color: activeBg === 'transparent' ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🏁 Transparent Canvas
            </button>
            <button 
              onClick={() => setActiveBg('white')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeBg === 'white' ? '#0F172A' : 'transparent',
                color: activeBg === 'white' ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ⬜ Pure White
            </button>
            <button 
              onClick={() => setActiveBg('light')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeBg === 'light' ? '#0F172A' : 'transparent',
                color: activeBg === 'light' ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ◽ Light Slate
            </button>
          </div>
        </div>

        {/* Featured SVG Display Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
          
          {/* Card 1: Transparent Single-Line Wordmark */}
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', border: '1px solid #E2E8F0', boxShadow: '0 15px 35px -10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#0F172A' }}>Transparent Background SVG</h3>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Single Line • Ultra-Thick Black Letters (`#0B0B0C`)</span>
              </div>
              <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: '12px' }}>Web & Overlay Standard</span>
            </div>

            <div style={{ ...getContainerBgStyle(), borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #CBD5E1', marginBottom: '1.75rem', transition: 'all 0.3s ease' }}>
              <img src="/viyona-wordmark-transparent.svg" alt="Viyona Designs Transparent SVG Wordmark" style={{ maxWidth: '100%', height: 'auto', maxHeight: '110px' }} />
            </div>

            <a href="/viyona-wordmark-transparent.svg" download="viyona-wordmark-transparent.svg" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '1rem', borderRadius: '12px', background: '#0F172A', color: '#FFFFFF', fontWeight: 800, letterSpacing: '1px', textDecoration: 'none' }}>
              Download Transparent SVG
            </a>
          </div>

          {/* Card 2: Pure White Background Trademark Wordmark */}
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', border: '1px solid #E2E8F0', boxShadow: '0 15px 35px -10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#0F172A' }}>Pure White Background SVG</h3>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Single Line • High-Contrast Legal Trademark Mark</span>
              </div>
              <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: '12px' }}>Trademark Filing Standard</span>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #E2E8F0', marginBottom: '1.75rem' }}>
              <img src="/viyona-wordmark-white.svg" alt="Viyona Designs Pure White SVG Wordmark" style={{ maxWidth: '100%', height: 'auto', maxHeight: '110px' }} />
            </div>

            <a href="/viyona-wordmark-white.svg" download="viyona-wordmark-white.svg" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '1rem', borderRadius: '12px', background: '#1E293B', color: '#FFFFFF', fontWeight: 800, letterSpacing: '1px', textDecoration: 'none' }}>
              Download White Background SVG
            </a>
          </div>

        </div>

        {/* Real World White & Transparent Mockups */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', border: '1px solid #E2E8F0', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: '#0F172A' }}>
            White & Transparent Background Mockups
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.75rem', color: '#475569', fontSize: '1rem' }}>Ultra-Thick Dark Wordmark on High-Contrast White Surface</h4>
              <img src="/viyona_thick_dark_white_bg.jpg" alt="Viyona Designs Thick Dark Wordmark White BG" style={{ width: '100%', borderRadius: '16px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.75rem', color: '#475569', fontSize: '1rem' }}>Transparent Product Overlay & Trademark Document Presentation</h4>
              <img src="/viyona_transparent_white_applications.jpg" alt="Viyona Designs Transparent & White Applications" style={{ width: '100%', borderRadius: '16px', border: '1px solid #E2E8F0' }} />
            </div>
          </div>
        </div>

        {/* Color Palette Specifications */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: '#0F172A' }}>
            Color & Transparency Specifications
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
            {darkTextColors.map((c) => (
              <div key={c.name} style={{ background: '#F8FAFC', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                <div style={{ 
                  height: '70px', 
                  background: c.hex === 'TRANSPARENT' ? 'radial-gradient(#94A3B8 1px, transparent 0) #E2E8F0' : c.hex, 
                  backgroundSize: c.hex === 'TRANSPARENT' ? '12px 12px' : 'auto',
                  borderRadius: '10px', 
                  marginBottom: '1rem', 
                  border: '1px solid rgba(0,0,0,0.1)' 
                }} />
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', marginBottom: '0.25rem' }}>{c.name}</div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{c.usage}</div>
                <button 
                  onClick={() => handleCopy(c.hex)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '8px', 
                    border: '1px solid #CBD5E1', 
                    background: '#FFFFFF', 
                    color: '#0F172A',
                    fontSize: '0.85rem', 
                    fontWeight: 800, 
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{c.hex}</span>
                  <span style={{ color: copiedHex === c.hex ? '#16A34A' : '#64748B' }}>
                    {copiedHex === c.hex ? '✓ Copied' : 'Copy'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
