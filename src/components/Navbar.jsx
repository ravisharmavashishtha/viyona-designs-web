import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header style={{ 
      borderBottom: '1px solid #eaeaea', 
      padding: '1rem 0',
      backgroundColor: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-0.5px', textDecoration: 'none', color: 'inherit' }}>
          Viyona Designs
        </Link>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ fontWeight: '500', textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <a href="/#shop" style={{ fontWeight: '500', textDecoration: 'none', color: 'inherit' }}>Shop</a>
          <Link to="/about" style={{ fontWeight: '500', textDecoration: 'none', color: 'inherit' }}>About</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
