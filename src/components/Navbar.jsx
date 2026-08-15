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
      }, 100);
    }
  };

  const handleStoryClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/about');
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
            gap: 'clamp(1.5rem, 2.5vw, 2.75rem)'
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
            <a 
              href="#collection" 
              onClick={handleShopClick} 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: '500', 
                color: 'var(--text-secondary)',
                letterSpacing: '0.01em',
                cursor: 'pointer',
                padding: '0.35rem 0'
              }}
            >
              Collection
            </a>
            <a 
              href="#craft" 
              onClick={handleStoryClick} 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: '500', 
                color: 'var(--text-secondary)',
                letterSpacing: '0.01em',
                cursor: 'pointer',
                padding: '0.35rem 0'
              }}
            >
              Our Craft
            </a>
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
              Explore Studio
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
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
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Nav Items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: 'auto' }}>
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
                  justifyContent: 'space-between'
                }}
              >
                <span>🏠 Home</span>
                {location.pathname === '/' && <span style={{ color: 'var(--accent-gold)' }}>●</span>}
              </Link>

              <a 
                href="#collection" 
                onClick={handleShopClick}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>🏺 The Collection</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→</span>
              </a>

              <a 
                href="#craft" 
                onClick={handleStoryClick}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>🌿 Our Craft & Values</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→</span>
              </a>

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
                  justifyContent: 'space-between'
                }}
              >
                <span>📖 About Us & Story</span>
                {location.pathname === '/about' && <span style={{ color: 'var(--accent-gold)' }}>●</span>}
              </Link>
            </nav>

            {/* Drawer Bottom Actions */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--accent-sage)',
                backgroundColor: 'var(--accent-sage-light)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                width: 'fit-content',
                marginBottom: '0.5rem'
              }}>
                <span>🌱</span> 100% Plant-Based Bio-Plastic
              </div>

              <a 
                href="#collection" 
                onClick={handleShopClick}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                Explore Studio
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