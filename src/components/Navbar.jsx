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
        paddingTop: '0.85rem',
        paddingBottom: '0.85rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={logoImg} 
            alt="Viyona Designs" 
            style={{ 
              height: '52px', 
              objectFit: 'contain',
              transition: 'transform var(--transition-base)'
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              fontSize: '0.92rem',
              fontWeight: '500', 
              color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing: '0.01em',
              transition: 'color var(--transition-fast)'
            }}
          >
            Home
          </Link>
          <a 
            href="#collection" 
            onClick={handleShopClick} 
            style={{ 
              fontSize: '0.92rem',
              fontWeight: '500', 
              color: 'var(--text-secondary)',
              letterSpacing: '0.01em',
              cursor: 'pointer'
            }}
          >
            Collection
          </a>
          <a 
            href="#craft" 
            onClick={handleStoryClick} 
            style={{ 
              fontSize: '0.92rem',
              fontWeight: '500', 
              color: 'var(--text-secondary)',
              letterSpacing: '0.01em',
              cursor: 'pointer'
            }}
          >
            Our Craft
          </a>
          <Link 
            to="/about" 
            style={{ 
              fontSize: '0.92rem',
              fontWeight: '500', 
              color: location.pathname === '/about' ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing: '0.01em'
            }}
          >
            About Us
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a 
            href="#collection" 
            onClick={handleShopClick}
            className="btn btn-primary"
            style={{ 
              padding: '0.65rem 1.4rem', 
              fontSize: '0.85rem' 
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
