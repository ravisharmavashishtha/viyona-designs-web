import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

function Navbar() {
  return (
    <header style={{ 
      borderBottom: '1px solid #eaeaea', 
      padding: '0.75rem 0',
      backgroundColor: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoImg} alt="Viyona Designs" style={{ height: '64px', objectFit: 'contain' }} />
        </Link>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ fontWeight: '500', textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <a href="/#shop" style={{ fontWeight: '500', textDecoration: 'none', color: 'inherit' }}>Shop</a>
          <Link to="/about" style={{ fontWeight: '500', textDecoration: 'none', color: 'inherit' }}>About</Link>
          <Link to="/brand-assets" style={{ fontWeight: '600', textDecoration: 'none', color: '#4285F4' }}>Brand &amp; Trademark</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
