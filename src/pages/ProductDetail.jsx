import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useEffect, useState } from 'react';

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [mainImage, setMainImage] = useState(product ? product.images[0] : null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.images[0]);
      document.title = `${product.displayName || product.name} | Viyona Designs`;
    }
    return () => {
      document.title = 'Viyona Designs | Distinct, High-Precision Design Goods';
    };
  }, [id, product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The studio piece you are looking for might have been moved or updated.
        </p>
        <Link to="/" className="btn btn-primary">Return to Collection</Link>
      </div>
    );
  }

  const otherProducts = products.filter(p => p.id !== product.id);
  const currentUrl = window.location.href;
  const shareText = `Discover ${product.name} on Viyona Designs: ${product.shortDesc}`;

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
    <div style={{ padding: '2.5rem 0 6rem', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Studio</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{product.displayName || product.name}</span>
        </div>

        {/* Main Product Showcase Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '4rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Interactive Image Gallery */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {product.badge && (
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2 }}>
                  <span className={`badge ${product.badgeColor === 'gold' ? 'badge-gold' : 'badge-sage'}`}>
                    {product.badge}
                  </span>
                </div>
              )}
              <img 
                src={mainImage} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }} 
              />
            </div>

            {/* Thumbnail Selector */}
            <div style={{ 
              display: 'flex', 
              gap: '0.85rem', 
              overflowX: 'auto', 
              paddingBottom: '0.5rem' 
            }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: mainImage === img ? '2px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                    padding: 0,
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    opacity: mainImage === img ? 1 : 0.65,
                    transition: 'all var(--transition-fast)',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} preview ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Narrative, Specs, CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)' }}>
                  {product.category}
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: '600', color: '#B88E52' }}>
                  <span>★</span> {product.rating} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              <h1 style={{ 
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', 
                fontWeight: '600', 
                lineHeight: 1.15, 
                marginBottom: '0.75rem',
                color: 'var(--text-primary)'
              }}>
                {product.name}
              </h1>

              {product.tagline && (
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                  "{product.tagline}"
                </p>
              )}

              {/* Pricing & Stock Banner */}
              <div style={{ 
                padding: '1.25rem 1.5rem', 
                backgroundColor: '#FFFFFF', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {product.price}
                    </span>
                    {product.mrp && (
                      <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {product.mrp}
                      </span>
                    )}
                    {product.discount && (
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)' }}>
                        Save {product.discount}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Inclusive of all taxes & doorstep delivery
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>●</span> In Stock & Ready to Ship
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Fulfilled via Amazon Prime
                  </span>
                </div>
              </div>

              {/* Primary Buy CTA */}
              <a 
                href={product.amazonLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-amazon"
                style={{ 
                  width: '100%', 
                  padding: '1.15rem', 
                  fontSize: '1.1rem', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
              >
                <span>🛒</span> Order Directly on Amazon India ↗
              </a>

              {/* Guaranteed Trust Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>📦</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>Safe Box Packaging</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>🌱</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>100% Bio-Plastic</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>⚡</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>Fast Prime Dispatch</div>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '600', marginBottom: '0.85rem' }}>
                The Story Behind the Design
              </h3>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {product.description}
              </p>
            </div>

            {/* Interactive Detail Tabs */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setActiveTab('about')}
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    background: activeTab === 'about' ? 'var(--bg-subtle)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'about' ? '2px solid var(--text-primary)' : 'none',
                    fontWeight: activeTab === 'about' ? '700' : '500',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    color: activeTab === 'about' ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  Key Highlights
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    background: activeTab === 'specs' ? 'var(--bg-subtle)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'specs' ? '2px solid var(--text-primary)' : 'none',
                    fontWeight: activeTab === 'specs' ? '700' : '500',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    color: activeTab === 'specs' ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  Specifications
                </button>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {activeTab === 'about' && (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {product.bullets.map((b, idx) => {
                      const [title, ...rest] = b.split(':');
                      return (
                        <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--accent-gold)', fontSize: '1rem', marginTop: '0.1rem' }}>✦</span>
                          <span style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{title}:</strong> {rest.join(':')}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {activeTab === 'specs' && product.specs && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem 2rem' }}>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key}>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          {key}
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Social Share Bar */}
            <div style={{ 
              padding: '1.25rem 1.5rem', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)' 
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Share with Friends & Family:
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  onClick={shareOnWhatsApp} 
                  style={{ 
                    padding: '0.5rem 0.95rem', 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem' 
                  }}
                >
                  💬 WhatsApp
                </button>
                <button 
                  onClick={shareOnFacebook} 
                  style={{ 
                    padding: '0.5rem 0.95rem', 
                    backgroundColor: '#1877F2', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem' 
                  }}
                >
                  📘 Facebook
                </button>
                <button 
                  onClick={shareOnPinterest} 
                  style={{ 
                    padding: '0.5rem 0.95rem', 
                    backgroundColor: '#E60023', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem' 
                  }}
                >
                  📌 Pinterest
                </button>
                <button 
                  onClick={shareOnX} 
                  style={{ 
                    padding: '0.5rem 0.95rem', 
                    backgroundColor: '#000000', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem' 
                  }}
                >
                  𝕏 Post
                </button>
                <button 
                  onClick={handleCopyLink} 
                  style={{ 
                    padding: '0.5rem 0.95rem', 
                    backgroundColor: copied ? '#10B981' : 'var(--bg-subtle)', 
                    color: copied ? 'white' : 'var(--text-primary)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    transition: 'all 0.2s ease' 
                  }}
                >
                  {copied ? '✓ Link Copied' : '🔗 Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Other Creations */}
        {otherProducts.length > 0 && (
          <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '2rem', textAlign: 'center' }}>
              Explore Other Studio Creations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {otherProducts.map(other => (
                <Link 
                  key={other.id} 
                  to={`/product/${other.id}`}
                  className="card-interactive"
                  style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem', alignItems: 'center' }}
                >
                  <img 
                    src={other.images[0]} 
                    alt={other.name} 
                    style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#FAF9F6' }} 
                  />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
                      {other.category}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem' }}>
                      {other.displayName || other.name}
                    </h4>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {other.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
