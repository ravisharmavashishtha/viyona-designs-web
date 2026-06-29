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
        <Link to="/" style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
          Viyona Designs
        </Link>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ fontWeight: '500' }}>Home</Link>
          <a href="#shop" style={{ fontWeight: '500' }}>Shop</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
