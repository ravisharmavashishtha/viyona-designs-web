import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useEffect } from 'react';

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
        ← Back to Collection
      </Link>
      
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        {/* Product Image Section */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ 
            backgroundColor: product.imageColor, 
            minHeight: '350px', 
            aspectRatio: '1',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            opacity: 0.8
          }}>
            [Product Image Here]
          </div>
        </div>

        {/* Product Info Section */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1.2, marginBottom: '0.5rem' }}>{product.name}</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>{product.shortDesc}</p>
          </div>
          
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{product.description}</p>
          
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>About this item</h3>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              {product.bullets.map((bullet, idx) => (
                <li key={idx} style={{ lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text-main)' }}>{bullet.split(':')[0]}:</strong>
                  {bullet.split(':')[1]}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #eaeaea' }}>
            <a href={product.amazonLink} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
              Buy on Amazon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
