import { Link } from 'react-router-dom';
import { products } from '../data/products';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-2px', color: 'var(--color-accent)' }}>
            Viyona Designs
          </h1>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '500', marginBottom: '1.5rem', letterSpacing: '-0.5px', color: 'var(--color-text-main)' }}>
            Thoughtfully Designed. Perfectly Made.
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
            Elevating everyday Indian living through meticulously engineered, high-quality household solutions you won't find anywhere else.
          </p>
          <button 
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} 
            className="btn btn-primary"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Our Collection</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: products.length === 1 ? 'minmax(250px, 400px)' : 'repeat(auto-fit, minmax(250px, 1fr))', 
            justifyContent: products.length === 1 ? 'center' : 'start',
            gap: '2rem' 
          }}>
            {products.map(product => (
              <div key={product.id} style={{ border: '1px solid #eaeaea', borderRadius: 'var(--radius)', overflow: 'hidden', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>{product.name}</h3>
                </Link>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', flex: 1 }}>{product.shortDesc}</p>
                <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
