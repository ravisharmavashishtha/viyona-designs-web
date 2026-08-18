import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useEffect, useState, useRef } from 'react';
import { trackEvent, trackMetaEvent } from '../utils/analytics';

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id || (p.id === 'sleeping-puppy-organizer' && (id === 'sleeping-puppy' || id === 'sleeping-puppy-tray')));
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const touchStartX = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImgIdx(0);
    if (product) {
      // Dynamic SEO Title & Meta Updates
      const pageTitle = `${product.displayName || product.name} — ${product.price} | Viyona Designs`;
      document.title = pageTitle;

      // Standard Meta Pixel ViewContent Event
      trackMetaEvent('ViewContent', {
        content_name: product.displayName || product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: parseFloat(product.price.replace(/[^0-9.]/g, '')) || 550,
        currency: 'INR'
      });

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
      document.title = 'Viyona Designs — Thoughtfully Designed. Perfectly Made. | Modern Eco-Friendly Decor & Home Products';
    };
  }, [id, product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The product you are looking for might have been moved or updated.
        </p>
        <Link to="/" className="btn btn-primary">Return to Collection</Link>
      </div>
    );
  }

  const otherProducts = products.filter(p => p.id !== product.id);
  const currentUrl = window.location.href;
  const currentImage = product.images[activeImgIdx] || product.images[0];
  const shareTitle = `${product.displayName || product.name} by Viyona Designs`;
  const shareText = `✨ Discover the ${product.displayName || product.name} by Viyona Designs!\n🌱 100% Plant-Based Bio-Plastic | Made in India\n💰 Price: ${product.price} (M.R.P. ${product.mrp})\n\n`;

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
    trackEvent('share_product', { method: 'whatsapp', product_id: product.id, product_name: product.name });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}${currentUrl}`)}`, '_blank');
  };

  const shareOnFacebook = () => {
    trackEvent('share_product', { method: 'facebook', product_id: product.id, product_name: product.name });
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareOnPinterest = () => {
    trackEvent('share_product', { method: 'pinterest', product_id: product.id, product_name: product.name });
    const fullImgUrl = `${window.location.origin}${currentImage}`;
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(fullImgUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnX = () => {
    trackEvent('share_product', { method: 'x_twitter', product_id: product.id, product_name: product.name });
    const tweetText = `${shareTitle} — ${product.shortDesc} #HomeDecor #EcoFriendly #ViyonaDesigns #MadeInIndia`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  const handleCopyLink = () => {
    trackEvent('share_product', { method: 'copy_link', product_id: product.id, product_name: product.name });
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Touch Swipe Handlers for Mobile Gallery
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next image
        setActiveImgIdx((prev) => (prev + 1) % product.images.length);
      } else {
        // Swipe right -> prev image
        setActiveImgIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <article style={{ padding: 'clamp(1.5rem, 3.5vw, 3rem) 0 clamp(5rem, 8vw, 7rem)', backgroundColor: 'var(--bg-primary)', width: '100%' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{product.displayName || product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', 
          gap: 'clamp(2rem, 4vw, 4.5rem)',
          alignItems: 'start',
          width: '100%'
        }}>
          {/* Left Column: Interactive Mobile-First Image Gallery */}
          <section aria-label="Product Gallery" style={{ width: '100%' }}>
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                touchAction: 'pan-y'
              }}
            >
              <img 
                src={currentImage} 
                alt={`${product.name} - Product view ${activeImgIdx + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'opacity 0.25s ease'
                }} 
              />

              {/* Prev/Next Touch Buttons */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIdx((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    aria-label="Previous image"
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      color: 'var(--text-primary)',
                      padding: 0
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActiveImgIdx((prev) => (prev + 1) % product.images.length)}
                    aria-label="Next image"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      color: 'var(--text-primary)',
                      padding: 0
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image Counter Badge */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(18, 18, 17, 0.75)',
                backdropFilter: 'blur(8px)',
                color: '#FFF',
                fontSize: '0.72rem',
                fontWeight: '600',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.05em'
              }}>
                {activeImgIdx + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Selector */}
            <div style={{ 
              display: 'flex', 
              gap: '0.65rem', 
              overflowX: 'auto', 
              paddingBottom: '0.5rem',
              WebkitOverflowScrolling: 'touch'
            }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  aria-label={`View ${product.name} angle ${idx + 1}`}
                  style={{
                    width: 'clamp(64px, 15vw, 80px)',
                    height: 'clamp(64px, 15vw, 80px)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: activeImgIdx === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                    padding: 0,
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    opacity: activeImgIdx === idx ? 1 : 0.6,
                    transition: 'all var(--transition-fast)',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Right Column: Product Narrative, Specs, CTA */}
          <section aria-label="Product Information" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)' }}>
                  {product.category}
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--accent-sage)', backgroundColor: 'var(--accent-sage-light)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)' }}>
                  100% Plant-Based Bio-Plastic
                </span>
              </div>

              <h1 style={{ 
                fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)', 
                fontWeight: '600', 
                lineHeight: 1.15, 
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                {product.name}
              </h1>

              {product.tagline && (
                <p style={{ fontSize: 'clamp(0.98rem, 1.4vw, 1.15rem)', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                  "{product.tagline}"
                </p>
              )}

              {/* Pricing & Stock Banner */}
              <div style={{ 
                padding: '1rem 1.25rem', 
                backgroundColor: '#FFFFFF', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.1rem)', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {product.price}
                    </span>
                    {product.mrp && (
                      <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {product.mrp}
                      </span>
                    )}
                    {product.discount && (
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)' }}>
                        Save {product.discount}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Amazon India Price (M.R.P. {product.mrp})
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                    <span>●</span> In Stock
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Fast Pan-India Delivery
                  </span>
                </div>
              </div>

              {/* Primary Buy CTA */}
              <a 
                href={product.amazonLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => {
                  trackEvent('click_buy_amazon', { product_id: product.id, product_name: product.name, price: product.price, location: 'main_cta' });
                  trackMetaEvent('InitiateCheckout', { content_name: product.displayName || product.name, content_ids: [product.id], content_type: 'product', value: parseFloat(product.price.replace(/[^0-9.]/g, '')) || 550, currency: 'INR' });
                }}
                className="btn btn-amazon"
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  fontSize: '1.05rem', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
              >
                <span>🛒</span> Buy on Amazon India ↗
              </a>

              {/* Guaranteed Trust Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.75rem 0.4rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>📦</div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '600' }}>5×5×5" Gift Box</div>
                </div>
                <div style={{ padding: '0.75rem 0.4rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>🌱</div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '600' }}>100% Bio-Plastic</div>
                </div>
                <div style={{ padding: '0.75rem 0.4rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>🇮🇳</div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '600' }}>Made in India</div>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '600', marginBottom: '0.65rem' }}>
                The Story Behind the Design
              </h2>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {product.description}
              </p>
            </div>

            {/* Interactive Detail Tabs */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
                <button
                  onClick={() => setActiveTab('about')}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    background: activeTab === 'about' ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'about' ? '2px solid var(--accent-gold)' : '2px solid transparent',
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
                    padding: '0.85rem',
                    background: activeTab === 'specs' ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'specs' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                    fontWeight: activeTab === 'specs' ? '700' : '500',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    color: activeTab === 'specs' ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  Specifications
                </button>
              </div>

              <div style={{ padding: '1.25rem' }}>
                {activeTab === 'about' && (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {product.bullets.map((b, idx) => {
                      const [title, ...rest] = b.split(':');
                      return (
                        <li key={idx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--accent-gold)', fontSize: '1rem', marginTop: '0.1rem' }}>✦</span>
                          <span style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{title}:</strong> {rest.join(':')}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {activeTab === 'specs' && product.specs && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key}>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
                          {key}
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Social Share Bar with Native Share */}
            <div style={{ 
              padding: '1.15rem 1.25rem', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                  Share with Friends:
                </span>
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
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <span>📤</span> Share Sheet
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  onClick={shareOnWhatsApp} 
                  aria-label="Share on WhatsApp"
                  style={{ 
                    padding: '0.5rem 0.9rem', 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.82rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    width: 'auto'
                  }}
                >
                  💬 WhatsApp
                </button>
                <button 
                  onClick={shareOnFacebook} 
                  aria-label="Share on Facebook"
                  style={{ 
                    padding: '0.5rem 0.9rem', 
                    backgroundColor: '#1877F2', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.82rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    width: 'auto'
                  }}
                >
                  📘 Facebook
                </button>
                <button 
                  onClick={shareOnPinterest} 
                  aria-label="Pin on Pinterest"
                  style={{ 
                    padding: '0.5rem 0.9rem', 
                    backgroundColor: '#E60023', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.82rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    width: 'auto'
                  }}
                >
                  📌 Pinterest
                </button>
                <button 
                  onClick={shareOnX} 
                  aria-label="Post on X"
                  style={{ 
                    padding: '0.5rem 0.9rem', 
                    backgroundColor: '#000000', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.82rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    width: 'auto'
                  }}
                >
                  𝕏 Post
                </button>
                <button 
                  onClick={handleCopyLink} 
                  aria-label="Copy link"
                  style={{ 
                    padding: '0.5rem 0.9rem', 
                    backgroundColor: copied ? '#10B981' : 'var(--bg-subtle)', 
                    color: copied ? 'white' : 'var(--text-primary)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer', 
                    fontSize: '0.82rem', 
                    fontWeight: '600', 
                    transition: 'all 0.2s ease',
                    width: 'auto'
                  }}
                >
                  {copied ? '✓ Link Copied' : '🔗 Copy'}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Explore Other Creations */}
        {otherProducts.length > 0 && (
          <div style={{ marginTop: '4.5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
              Explore More Creations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
              {otherProducts.map(other => (
                <Link 
                  key={other.id} 
                  to={`/product/${other.id}`}
                  className="card-interactive"
                  style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', alignItems: 'center' }}
                >
                  <img 
                    src={other.images[0]} 
                    alt={other.name} 
                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#FAF9F6', flexShrink: 0 }} 
                  />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
                      {other.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0.2rem 0 0.35rem' }}>
                      {other.displayName || other.name}
                    </h4>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {other.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Mobile Bottom Action Bar */}
      <div className="sticky-mobile-bar">
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {product.price}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: '700' }}>
            Fast Pan-India Delivery
          </div>
        </div>

        <a 
          href={product.amazonLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={() => {
            trackEvent('click_buy_amazon', { product_id: product.id, product_name: product.name, price: product.price, location: 'mobile_sticky_bar' });
            trackMetaEvent('InitiateCheckout', { content_name: product.displayName || product.name, content_ids: [product.id], content_type: 'product', value: parseFloat(product.price.replace(/[^0-9.]/g, '')) || 550, currency: 'INR' });
          }}
          className="btn btn-amazon"
          style={{ 
            flex: '1', 
            maxWidth: '220px', 
            minHeight: '44px',
            padding: '0.65rem 1.25rem',
            fontSize: '0.92rem',
            borderRadius: 'var(--radius-full)'
          }}
        >
          Buy on Amazon ↗
        </a>
      </div>
    </article>
  );
}

export default ProductDetail;
