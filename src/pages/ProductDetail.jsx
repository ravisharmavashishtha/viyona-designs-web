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
      
      // Dynamic SEO Title & Meta Updates
      const pageTitle = `${product.displayName || product.name} — ${product.price} | Viyona Designs`;
      document.title = pageTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', product.description.slice(0, 160) + '...');

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', product.shortDesc);

      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', `${window.location.origin}${product.lifestyleImage || product.images[0]}`);
    }
    return () => {
      document.title = 'Viyona Designs — Thoughtfully Designed. Perfectly Made. | Modern Eco-Friendly Decor & Studio Objects';
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
  const shareTitle = `${product.displayName || product.name} by Viyona Designs`;
  const shareText = `✨ Discover the ${product.displayName || product.name} by Viyona Designs!\n🌱 100% Plant-Based Bio-Plastic | Made in India\n💰 Selling Price: ${product.price} (M.R.P. ${product.mrp})\n\n`;

  // Native Mobile Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle} — ${product.shortDesc}`,
          url: currentUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}${currentUrl}`)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareOnPinterest = () => {
    const fullImgUrl = `${window.location.origin}${mainImage}`;
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(fullImgUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnX = () => {
    const tweetText = `${shareTitle} — ${product.shortDesc} #HomeDecor #EcoFriendly #ViyonaDesigns #MadeInIndia`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article style={{ padding: 'clamp(2rem, 4vw, 3.5rem) 0 6rem', backgroundColor: 'var(--bg-primary)', width: '100%' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Studio</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{product.displayName || product.name}</span>
        </nav>

        {/* Main Product Showcase Grid - Full Width Responsive */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', 
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'start',
          width: '100%'
        }}>
          {/* Left Column: Interactive Image Gallery */}
          <section aria-label="Product Gallery" style={{ position: 'sticky', top: '100px', width: '100%' }}>
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
              position: 'relative',
              width: '100%'
            }}>
              <img 
                src={mainImage} 
                alt={`${product.name} - Official studio high-resolution photograph`} 
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
              paddingBottom: '0.5rem',
              WebkitOverflowScrolling: 'touch'
            }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  aria-label={`View ${product.name} angle ${idx + 1}`}
                  style={{
                    width: 'clamp(70px, 12vw, 84px)',
                    height: 'clamp(70px, 12vw, 84px)',
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
                    alt={`${product.name} perspective ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Right Column: Product Narrative, Specs, CTA */}
          <section aria-label="Product Information" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)' }}>
                  {product.category}
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--accent-sage)', backgroundColor: 'var(--accent-sage-light)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
                  100% Plant-Based Bio-Plastic
                </span>
              </div>

              <h1 style={{ 
                fontSize: 'clamp(2.1rem, 3.8vw, 3rem)', 
                fontWeight: '600', 
                lineHeight: 1.15, 
                marginBottom: '0.75rem',
                color: 'var(--text-primary)'
              }}>
                {product.name}
              </h1>

              {product.tagline && (
                <p style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
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
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: '800', color: 'var(--text-primary)' }}>
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
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Amazon India Selling Price (M.R.P. {product.mrp})
                  </span>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>●</span> Live on Amazon India
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Fast Prime Delivery Available
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
                  fontSize: '1.15rem', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
              >
                <span>🛒</span> Buy on Amazon India ↗
              </a>

              {/* Guaranteed Trust Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ padding: '0.85rem 0.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>📦</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '600' }}>5×5×5" Box Packaging</div>
                </div>
                <div style={{ padding: '0.85rem 0.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🌱</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '600' }}>100% Bio-Plastic</div>
                </div>
                <div style={{ padding: '0.85rem 0.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🇮🇳</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '600' }}>Made in India</div>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem' }}>
                The Story Behind the Design
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
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
                    padding: '1rem',
                    background: activeTab === 'about' ? 'var(--bg-subtle)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'about' ? '2px solid var(--text-primary)' : 'none',
                    fontWeight: activeTab === 'about' ? '700' : '500',
                    fontSize: '0.92rem',
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
                    padding: '1rem',
                    background: activeTab === 'specs' ? 'var(--bg-subtle)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'specs' ? '2px solid var(--text-primary)' : 'none',
                    fontWeight: activeTab === 'specs' ? '700' : '500',
                    fontSize: '0.92rem',
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
                          <span style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', marginTop: '0.1rem' }}>✦</span>
                          <span style={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
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
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          {key}
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Social Share Bar with Native Share & Channel Buttons */}
            <div style={{ 
              padding: '1.35rem 1.5rem', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                  Share with Friends & Family:
                </span>
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button 
                    onClick={handleNativeShare}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      backgroundColor: 'var(--accent-gold-light)',
                      color: 'var(--accent-gold-dark)',
                      border: '1px solid var(--accent-gold-border)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <span>📤</span> Share Sheet
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  onClick={shareOnWhatsApp} 
                  aria-label="Share product on WhatsApp"
                  style={{ 
                    padding: '0.6rem 1.1rem', 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.88rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.45rem',
                    width: 'auto'
                  }}
                >
                  💬 WhatsApp
                </button>
                <button 
                  onClick={shareOnFacebook} 
                  aria-label="Share product on Facebook"
                  style={{ 
                    padding: '0.6rem 1.1rem', 
                    backgroundColor: '#1877F2', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.88rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.45rem',
                    width: 'auto'
                  }}
                >
                  📘 Facebook
                </button>
                <button 
                  onClick={shareOnPinterest} 
                  aria-label="Pin product on Pinterest"
                  style={{ 
                    padding: '0.6rem 1.1rem', 
                    backgroundColor: '#E60023', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.88rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.45rem',
                    width: 'auto'
                  }}
                >
                  📌 Pinterest
                </button>
                <button 
                  onClick={shareOnX} 
                  aria-label="Post product on X"
                  style={{ 
                    padding: '0.6rem 1.1rem', 
                    backgroundColor: '#000000', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.88rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.45rem',
                    width: 'auto'
                  }}
                >
                  𝕏 Post
                </button>
                <button 
                  onClick={handleCopyLink} 
                  aria-label="Copy product URL to clipboard"
                  style={{ 
                    padding: '0.6rem 1.1rem', 
                    backgroundColor: copied ? '#10B981' : 'var(--bg-subtle)', 
                    color: copied ? 'white' : 'var(--text-primary)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.88rem', 
                    fontWeight: '600', 
                    transition: 'all 0.2s ease',
                    width: 'auto'
                  }}
                >
                  {copied ? '✓ Link Copied' : '🔗 Copy Link'}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Explore Other Creations */}
        {otherProducts.length > 0 && (
          <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '600', marginBottom: '2rem', textAlign: 'center' }}>
              Explore Other Studio Creations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '2rem' }}>
              {otherProducts.map(other => (
                <Link 
                  key={other.id} 
                  to={`/product/${other.id}`}
                  className="card-interactive"
                  style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'center' }}
                >
                  <img 
                    src={other.images[0]} 
                    alt={other.name} 
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#FAF9F6', flexShrink: 0 }} 
                  />
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
                      {other.category}
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0.25rem 0 0.5rem' }}>
                      {other.displayName || other.name}
                    </h4>
                    <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {other.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductDetail;
