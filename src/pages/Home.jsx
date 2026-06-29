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
          <a href="#shop" className="btn btn-primary">Explore Collection</a>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Our Collection</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            {products.map(product => (
              <div key={product.id} style={{ border: '1px solid #eaeaea', borderRadius: 'var(--radius)', overflow: 'hidden', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ height: '200px', backgroundColor: product.imageColor, marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}></div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                </Link>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>{product.shortDesc}</p>
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
