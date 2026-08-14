import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleShopClick = (e) => {
    e.preventDefault();
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
    if (location.pathname === '/') {
      document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/about');
    }
  };

  return (
    <header className="glass-header">
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo - Enlarged & Fluid Responsive */}
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
              height: 'clamp(58px, 6.5vw, 84px)', 
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              transition: 'transform var(--transition-base)',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.05))'
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Navigation Links */}
        <nav style={{ 
          display: 'flex', 
          gap: 'clamp(1.25rem, 2.5vw, 2.75rem)', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/" 
            style={{ 
              fontSize: '0.96rem',
              fontWeight: location.pathname === '/' ? '700' : '500', 
              color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing: '0.01em',
              padding: '0.35rem 0'
            }}
          >
            Home
          </Link>
          <a 
            href="#collection" 
            onClick={handleShopClick} 
            style={{ 
              fontSize: '0.96rem',
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
              fontSize: '0.96rem',
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
              fontSize: '0.96rem',
              fontWeight: location.pathname === '/about' ? '700' : '500', 
              color: location.pathname === '/about' ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing: '0.01em',
              padding: '0.35rem 0'
            }}
          >
            About Us
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a 
            href="#collection" 
            onClick={handleShopClick}
            className="btn btn-primary"
            style={{ 
              padding: '0.65rem 1.6rem', 
              fontSize: '0.9rem',
              minHeight: '44px',
              width: 'auto'
            }}
          >
            Explore Studio
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
