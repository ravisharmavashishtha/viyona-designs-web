import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useEffect, useState } from 'react';

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [mainImage, setMainImage] = useState(product ? product.images[0] : null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.images[0]);
      document.title = `${product.name} | Viyona Designs`;
    }
    return () => {
      document.title = 'Viyona Designs | Distinct, High-Precision Design Goods';
    };
  }, [id, product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const shareText = `Check out ${product.name} on Viyona Designs! ${product.shortDesc}`;

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareOnPinterest = () => {
    const fullImgUrl = `${window.location.origin}${mainImage}`;
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(fullImgUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
        ← Back to Collection
      </Link>
      
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        {/* Product Image Section */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img src={mainImage} alt={product.name} style={{ 
            width: '100%', 
            minHeight: '350px', 
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: 'var(--radius-lg)',
            display: 'block'
          }} />
          {/* Image Gallery Thumbnails */}
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {product.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${product.name} thumbnail ${idx + 1}`} 
                onClick={() => setMainImage(img)}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover', 
                  borderRadius: 'var(--radius-sm)', 
                  cursor: 'pointer',
                  border: mainImage === img ? '2px solid var(--color-accent)' : '1px solid transparent',
                  opacity: mainImage === img ? 1 : 0.6,
                  transition: 'all 0.2s ease'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.2, marginBottom: '0.5rem' }}>{product.name}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{product.shortDesc}</p>
          </div>
          
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#374151' }}>{product.description}</p>
          
          {/* Specifications Grid */}
          {product.specs && (
            <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Product Specifications</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem 1.5rem' }}>
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} style={{ fontSize: '0.9rem' }}>
                    <span style={{ color: '#6B7280', display: 'block', fontSize: '0.8rem', fontWeight: '600' }}>{key}</span>
                    <span style={{ color: '#111827', fontWeight: '500' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>About this item</h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              {product.bullets.map((bullet, idx) => (
                <li key={idx} style={{ lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text-main)' }}>{bullet.split(':')[0]}:</strong>
                  {bullet.split(':')[1]}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <a href={product.amazonLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
              Buy on Amazon India
            </a>

            {/* Social Media Sharing Section */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Share with Friends & Family:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={shareOnWhatsApp} style={{ padding: '0.45rem 0.85rem', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  💬 WhatsApp
                </button>
                <button onClick={shareOnFacebook} style={{ padding: '0.45rem 0.85rem', backgroundColor: '#1877F2', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  📘 Facebook
                </button>
                <button onClick={shareOnPinterest} style={{ padding: '0.45rem 0.85rem', backgroundColor: '#E60023', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  📌 Pinterest
                </button>
                <button onClick={shareOnX} style={{ padding: '0.45rem 0.85rem', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  𝕏 Post
                </button>
                <button onClick={handleCopyLink} style={{ padding: '0.45rem 0.85rem', backgroundColor: copied ? '#10B981' : '#E2E8F0', color: copied ? 'white' : '#1E293B', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s ease' }}>
                  {copied ? '✓ Link Copied' : '🔗 Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
