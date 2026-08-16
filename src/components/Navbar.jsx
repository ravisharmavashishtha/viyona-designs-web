import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleShopClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const handleStoryClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <>
      <header className="glass-header">
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '0.6rem',
          paddingBottom: '0.6rem',
          minHeight: '68px'
        }}>
          {/* Official Viyona Designs Brand Logo */}
          <Link 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <img 
              src={logoImg} 
              alt="Viyona Designs — Thoughtfully Designed. Perfectly Made." 
              style={{ 
                height: 'clamp(46px, 6vw, 68px)', 
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform var(--transition-base)'
              }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-only" style={{ 
            alignItems: 'center', 
            gap: 'clamp(1.25rem, 2vw, 2.5rem)'
          }}>
            <Link 
              to="/" 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: location.pathname === '/' ? '700' : '500', 
                color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
                letterSpacing: '0.01em',
                padding: '0.35rem 0',
                borderBottom: location.pathname === '/' ? '2px solid var(--accent-gold)' : '2px solid transparent'
              }}
            >
              Home
            </Link>
            <Link 
              to="/collection" 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: (location.pathname === '/collection' || location.pathname === '/products') ? '700' : '500', 
                color: (location.pathname === '/collection' || location.pathname === '/products') ? 'var(--text-primary)' : 'var(--text-secondary)',
                letterSpacing: '0.01em',
                padding: '0.35rem 0',
                borderBottom: (location.pathname === '/collection' || location.pathname === '/products') ? '2px solid var(--accent-gold)' : '2px solid transparent'
              }}
            >
              Collection
            </Link>
            <Link 
              to="/craft" 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: location.pathname === '/craft' ? '700' : '500', 
                color: location.pathname === '/craft' ? 'var(--text-primary)' : 'var(--text-secondary)',
                letterSpacing: '0.01em',
                padding: '0.35rem 0',
                borderBottom: location.pathname === '/craft' ? '2px solid var(--accent-gold)' : '2px solid transparent'
              }}
            >
              Our Craft
            </Link>
            <Link 
              to="/about" 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: location.pathname === '/about' ? '700' : '500', 
                color: location.pathname === '/about' ? 'var(--text-primary)' : 'var(--text-secondary)',
                letterSpacing: '0.01em',
                padding: '0.35rem 0',
                borderBottom: location.pathname === '/about' ? '2px solid var(--accent-gold)' : '2px solid transparent'
              }}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: location.pathname === '/contact' ? '700' : '500', 
                color: location.pathname === '/contact' ? 'var(--text-primary)' : 'var(--text-secondary)',
                letterSpacing: '0.01em',
                padding: '0.35rem 0',
                borderBottom: location.pathname === '/contact' ? '2px solid var(--accent-gold)' : '2px solid transparent'
              }}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right CTA Button */}
          <div className="desktop-only" style={{ alignItems: 'center' }}>
            <a 
              href="#collection" 
              onClick={handleShopClick}
              className="btn btn-primary"
              style={{ 
                padding: '0.65rem 1.6rem', 
                fontSize: '0.88rem',
                minHeight: '42px',
                width: 'auto'
              }}
            >
              Shop Collection
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              width: '44px',
              height: '44px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
              padding: 0
            }}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img 
                  src={logoImg} 
                  alt="Viyona Designs Logo" 
                  style={{ height: '42px', width: 'auto' }}
                />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Drawer"
                style={{
                  background: 'var(--bg-subtle)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Nav Items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: 'auto' }}>
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: location.pathname === '/' ? 'var(--bg-subtle)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: location.pathname === '/' ? '700' : '500',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '48px'
                }}
              >
                <span>🏠 Home</span>
                {location.pathname === '/' && <span style={{ color: 'var(--accent-gold)' }}>●</span>}
              </Link>

              <Link 
                to="/collection" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: (location.pathname === '/collection' || location.pathname === '/products') ? 'var(--bg-subtle)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: (location.pathname === '/collection' || location.pathname === '/products') ? '700' : '500',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '48px'
                }}
              >
                <span>🏺 The Collection</span>
                {(location.pathname === '/collection' || location.pathname === '/products') ? <span style={{ color: 'var(--accent-gold)' }}>●</span> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→</span>}
              </Link>

              <Link 
                to="/craft" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: location.pathname === '/craft' ? 'var(--bg-subtle)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: location.pathname === '/craft' ? '700' : '500',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '48px'
                }}
              >
                <span>🌿 Our Craft & Values</span>
                {location.pathname === '/craft' ? <span style={{ color: 'var(--accent-gold)' }}>●</span> : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→</span>}
              </Link>

              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: location.pathname === '/about' ? 'var(--bg-subtle)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: location.pathname === '/about' ? '700' : '500',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '48px'
                }}
              >
                <span>📖 About Us & Story</span>
                {location.pathname === '/about' && <span style={{ color: 'var(--accent-gold)' }}>●</span>}
              </Link>

              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: location.pathname === '/contact' ? 'var(--bg-subtle)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: location.pathname === '/contact' ? '700' : '500',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '48px'
                }}
              >
                <span>✉️ Contact & Support</span>
                {location.pathname === '/contact' && <span style={{ color: 'var(--accent-gold)' }}>●</span>}
              </Link>
            </nav>

            {/* Quick Policies Strip in Drawer */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem 1rem',
              padding: '1rem 0.5rem',
              marginTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.82rem'
            }}>
              <Link to="/shipping-policy" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Shipping Policy
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <Link to="/refund-policy" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Return Policy
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Privacy
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <Link to="/terms" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Terms
              </Link>
            </div>

            {/* Drawer Bottom Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.75rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--accent-sage)',
                backgroundColor: 'var(--accent-sage-light)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                width: 'fit-content'
              }}>
                <span>🌱</span> 100% Plant-Based Bio-Plastic
              </div>

              <a 
                href="#collection" 
                onClick={handleShopClick}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                Shop Collection
              </a>

              <a 
                href="https://www.amazon.in/dp/B0HF5124YZ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-amazon"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                Amazon India Storefront ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
