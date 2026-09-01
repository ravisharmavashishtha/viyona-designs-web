import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Truck, User } from 'lucide-react';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, openAccountDrawer } = useAuth();
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
              to="/track" 
              style={{ 
                fontSize: '0.94rem',
                fontWeight: location.pathname === '/track' ? '700' : '500', 
                color: location.pathname === '/track' ? 'var(--text-primary)' : 'var(--text-secondary)',
                letterSpacing: '0.01em',
                padding: '0.35rem 0',
                borderBottom: location.pathname === '/track' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Truck style={{ width: '15px', height: '15px', color: 'var(--accent-gold)' }} />
              <span>Track Order</span>
            </Link>
          </nav>

          {/* Desktop Right CTA Button + Cart Icon + Account Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            
            {/* Account Icon Trigger */}
            <button
              onClick={isAuthenticated ? openAccountDrawer : openAuthModal}
              aria-label={isAuthenticated ? "Open My Account" : "Sign In to Viyona"}
              title={isAuthenticated ? `Collector Account (${user?.name || user?.phone})` : "Sign In / Register"}
              style={{
                background: isAuthenticated ? 'rgba(158, 116, 58, 0.08)' : 'var(--bg-surface)',
                border: isAuthenticated ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isAuthenticated ? 'var(--accent-gold-dark)' : 'var(--text-primary)',
                position: 'relative',
                transition: 'transform 0.15s ease, background 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isAuthenticated ? (
                <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--accent-gold-dark)' }}>
                  {(user?.name || user?.phone || 'V')[0].toUpperCase()}
                </span>
              ) : (
                <User style={{ width: '20px', height: '20px', color: 'var(--text-primary)' }} />
              )}
            </button>

            {/* Cart Icon Trigger */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Cart"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                position: 'relative',
                transition: 'transform 0.15s ease, background 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ShoppingBag style={{ width: '20px', height: '20px', color: 'var(--text-primary)' }} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Desktop Shop Button */}
            <div className="desktop-only">
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
                display: 'flex',
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

            {/* Drawer Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Account / Sign In Action in Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAuthenticated) {
                    openAccountDrawer();
                  } else {
                    openAuthModal();
                  }
                }}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isAuthenticated ? 'rgba(158, 116, 58, 0.12)' : 'linear-gradient(135deg, #0C2340 0%, #1A365D 100%)',
                  color: isAuthenticated ? 'var(--text-primary)' : '#FFFFFF',
                  border: isAuthenticated ? '1px solid var(--accent-gold)' : 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User style={{ width: '18px', height: '18px', color: isAuthenticated ? 'var(--accent-gold)' : '#F3E5AB' }} />
                  <span>{isAuthenticated ? `${user?.name || 'My Account'} (+91 ${user?.phone})` : 'Sign In / Register'}</span>
                </div>
                <span>{isAuthenticated ? '⚙️' : '→'}</span>
              </button>

              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: location.pathname === '/' ? 'var(--bg-subtle)' : 'transparent',
                  color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/' ? '700' : '500',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Home</span>
                <span>→</span>
              </Link>
              <Link 
                to="/collection" 
                onClick={handleShopClick}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: location.pathname === '/collection' ? 'var(--bg-subtle)' : 'transparent',
                  color: location.pathname === '/collection' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/collection' ? '700' : '500',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>All Creations</span>
                <span>→</span>
              </Link>
              <Link 
                to="/craft" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: location.pathname === '/craft' ? 'var(--bg-subtle)' : 'transparent',
                  color: location.pathname === '/craft' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/craft' ? '700' : '500',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Our Craft & Materials</span>
                <span>→</span>
              </Link>
              <Link 
                to="/track" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: location.pathname === '/track' ? 'var(--bg-subtle)' : 'transparent',
                  color: location.pathname === '/track' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/track' ? '700' : '500',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Track Order</span>
                <span>🚚</span>
              </Link>
              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: location.pathname === '/about' ? 'var(--bg-subtle)' : 'transparent',
                  color: location.pathname === '/about' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/about' ? '700' : '500',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>About Us</span>
                <span>→</span>
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: location.pathname === '/contact' ? 'var(--bg-subtle)' : 'transparent',
                  color: location.pathname === '/contact' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/contact' ? '700' : '500',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Contact & Studio</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
