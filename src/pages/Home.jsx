import { Link } from 'react-router-dom';
import { products } from '../data/products';

function Home() {
  const ganeshaProduct = products.find(p => p.id === 'ganesha-statue') || products[0];

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {/* 1. Dramatic Full-Width Editorial Hero Section */}
      <section style={{ 
        padding: 'clamp(2.5rem, 5vw, 6rem) 0',
        background: 'radial-gradient(ellipse at top, #FFFDF8 0%, #FAF8F2 60%, #F3EFE6 100%)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', 
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div className="fade-in" style={{ width: '100%', maxWidth: '620px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge badge-gold">Design Studio</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  Precision-Engineered 3D Objects
                </span>
              </div>

              <h1 style={{ 
                fontSize: 'clamp(2.1rem, 5vw, 4.2rem)', 
                fontWeight: '600', 
                letterSpacing: '-0.025em', 
                lineHeight: 1.12,
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}>
                Sculpted With Intention. <br />
                <span style={{ fontStyle: 'italic', fontWeight: '400', color: 'var(--accent-gold)' }}>
                  Engineered for Modern Living.
                </span>
              </h1>

              <p style={{ 
                fontSize: 'clamp(0.98rem, 1.3vw, 1.18rem)', 
                lineHeight: 1.65, 
                color: 'var(--text-secondary)', 
                marginBottom: '1.75rem' 
              }}>
                Elevate your home sanctuary, car dashboard, and daily workspace with distinctive, eco-conscious design goods engineered from 100% plant-based bio-polymers.
              </p>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '0.85rem', 
                flexWrap: 'wrap', 
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <a 
                  href="#collection" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-primary"
                  style={{ flex: '1 1 200px', minWidth: '180px' }}
                >
                  Explore Collection
                </a>
                <Link 
                  to={`/product/${ganeshaProduct.id}`}
                  className="btn btn-secondary"
                  style={{ flex: '1 1 180px', minWidth: '160px' }}
                >
                  View Ganesha Idol →
                </Link>
              </div>

              {/* Verified Authentic Facts */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(0.75rem, 2vw, 1.5rem)', 
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
                    100% Bio
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '0.2rem' }}>
                    Plant-Based Material
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
                    Zero-Waste
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '0.2rem' }}>
                    Additive Precision
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
                    Made in India
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '0.2rem' }}>
                    Designed & Crafted
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(233, 230, 220, 0.8)',
                background: '#FFFFFF',
                width: '100%'
              }}>
                <img 
                  src="/first_post_ganesha_option2.jpg" 
                  alt="Lord Ganesha Modern Minimalist Statue in Serene Ambient Setting" 
                  style={{ 
                    width: '100%', 
                    height: 'clamp(280px, 40vw, 480px)', 
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
                
                {/* Responsive Integrated Caption Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: 'clamp(0.6rem, 1.5vw, 1.25rem)',
                  left: 'clamp(0.6rem, 1.5vw, 1.25rem)',
                  right: 'clamp(0.6rem, 1.5vw, 1.25rem)',
                  padding: 'clamp(0.75rem, 1.5vw, 1.2rem)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-md)',
                  gap: '0.75rem'
                }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', display: 'block' }}>
                      Contemporary Vinayaka
                    </span>
                    <h3 style={{ fontSize: 'clamp(0.88rem, 1.8vw, 1.1rem)', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Lord Ganesha Minimalist Murti
                    </h3>
                  </div>
                  <Link 
                    to="/product/ganesha-statue" 
                    className="btn btn-primary"
                    style={{ 
                      padding: '0.45rem 0.95rem', 
                      fontSize: '0.82rem', 
                      width: 'auto', 
                      minHeight: '36px',
                      flexShrink: 0 
                    }}
                  >
                    View ₹550
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
            alignItems: 'center'
          }}>
            <div className="trust-item">
              <span style={{ fontSize: '1.2rem' }}>🌱</span>
              <span>100% Bio-Plastic</span>
            </div>
            <div className="trust-item">
              <span style={{ fontSize: '1.2rem' }}>📐</span>
              <span>Precision Additive Craft</span>
            </div>
            <div className="trust-item">
              <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
              <span>Made in India</span>
            </div>
            <div className="trust-item">
              <span style={{ fontSize: '1.2rem' }}>📦</span>
              <span>Gift-Ready Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Product Collection */}
      <section id="collection" style={{ padding: 'clamp(3rem, 6vw, 6rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto clamp(2rem, 4vw, 3.5rem)' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.65rem' }}>
              The Studio Collection
            </span>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 3rem)', fontWeight: '600', marginBottom: '0.75rem' }}>
              Distinct Objects of Daily Joy
            </h2>
            <p style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.12rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Each piece in our catalog is thoughtfully engineered from the ground up, blending scandinavian minimalism, eco-friendly materials, and tactile beauty.
            </p>
          </div>

          {/* Responsive Product Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', 
            gap: 'clamp(1.75rem, 3vw, 2.75rem)' 
          }}>
            {products.map(product => (
              <div 
                key={product.id} 
                className="card-interactive" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  width: '100%'
                }}
              >
                {/* Product Image Container */}
                <Link 
                  to={`/product/${product.id}`} 
                  style={{ 
                    display: 'block', 
                    overflow: 'hidden', 
                    position: 'relative',
                    backgroundColor: '#FAF9F6',
                    height: 'clamp(280px, 30vw, 380px)'
                  }}
                >
                  <img 
                    src={product.lifestyleImage || product.images[0]} 
                    alt={product.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </Link>

                {/* Product Info Body */}
                <div style={{ 
                  padding: 'clamp(1.2rem, 3vw, 2rem)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {product.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--accent-sage)', backgroundColor: 'var(--accent-sage-light)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)' }}>
                      100% Bio-Plastic
                    </span>
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <h3 style={{ 
                      fontSize: 'clamp(1.25rem, 2vw, 1.55rem)', 
                      fontWeight: '600', 
                      lineHeight: 1.25, 
                      marginBottom: '0.6rem',
                      color: 'var(--text-primary)'
                    }}>
                      {product.displayName || product.name}
                    </h3>
                  </Link>

                  <p style={{ 
                    fontSize: '0.92rem', 
                    color: 'var(--text-secondary)', 
                    lineHeight: 1.6, 
                    marginBottom: '1.25rem',
                    flex: 1
                  }}>
                    {product.shortDesc}
                  </p>

                  {/* Highlights Pill List */}
                  {product.highlights && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {product.highlights.map((h, i) => (
                        <span key={i} style={{ 
                          fontSize: '0.74rem', 
                          padding: '0.25rem 0.65rem', 
                          backgroundColor: 'var(--bg-subtle)', 
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-secondary)',
                          fontWeight: '500'
                        }}>
                          {h.label}: <strong style={{ color: 'var(--text-primary)' }}>{h.value}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pricing & CTA Row */}
                  <div style={{ 
                    paddingTop: '1.25rem', 
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    marginTop: 'auto'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {product.price}
                        </span>
                        {product.mrp && (
                          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {product.mrp}
                          </span>
                        )}
                      </div>
                      {product.discount && (
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16A34A' }}>
                          Save {product.discount}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                      <Link 
                        to={`/product/${product.id}`} 
                        className="btn btn-secondary"
                        style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', minHeight: '40px', flex: '1 1 90px' }}
                      >
                        Details
                      </Link>
                      <a 
                        href={product.amazonLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-amazon"
                        style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', minHeight: '40px', flex: '1 1 140px' }}
                      >
                        Buy on Amazon ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Craft & Sustainability Story Section */}
      <section id="craft" style={{ 
        padding: 'clamp(3.5rem, 6vw, 6rem) 0', 
        backgroundColor: 'var(--bg-dark)', 
        color: 'var(--text-inverse)',
        width: '100%'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', 
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: '700', 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                color: '#D4AF37',
                marginBottom: '0.85rem',
                display: 'block'
              }}>
                The Future of Sustainable Craft
              </span>
              <h2 style={{ 
                fontSize: 'clamp(1.9rem, 3.5vw, 3rem)', 
                fontWeight: '600', 
                color: '#FFFFFF',
                lineHeight: 1.18,
                marginBottom: '1.25rem'
              }}>
                Where Precision Additive Engineering Meets Timeless Soul.
              </h2>
              <p style={{ 
                fontSize: 'clamp(0.95rem, 1.2vw, 1.08rem)', 
                color: 'var(--text-inverse-muted)', 
                lineHeight: 1.7, 
                marginBottom: '1.25rem' 
              }}>
                Traditional decor manufacturing relies on toxic petrochemical plastics, wasteful molds, and high-carbon logistics. At Viyona Designs, we pioneer zero-waste additive manufacturing right here in India.
              </p>
              <p style={{ 
                fontSize: 'clamp(0.95rem, 1.2vw, 1.08rem)', 
                color: 'var(--text-inverse-muted)', 
                lineHeight: 1.7, 
                marginBottom: '2rem' 
              }}>
                Every single curve is shaped through sub-millimeter extrusion using 100% plant-based renewable bio-polymers — giving you a warm, matte tactile feel that is kind to your sanctuary and the planet.
              </p>
              <Link to="/about" className="btn btn-gold" style={{ width: 'fit-content' }}>
                Read Our Story & Founder Note
              </Link>
            </div>

            {/* Feature Grid Display */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', 
              gap: '1rem',
              width: '100%'
            }}>
              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: 'var(--bg-dark-surface)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🌿</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', marginBottom: '0.35rem' }}>100% Bio-Plastic</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-inverse-muted)', lineHeight: 1.5 }}>
                  Crafted from natural corn starch and sugar cane polymers. Zero toxic fumes, biodegradable and durable.
                </p>
              </div>

              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: 'var(--bg-dark-surface)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📐</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', marginBottom: '0.35rem' }}>Zero-Waste Craft</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-inverse-muted)', lineHeight: 1.5 }}>
                  Engineered layer by layer with zero industrial scrap or mold runoff.
                </p>
              </div>

              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: 'var(--bg-dark-surface)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>✨</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', marginBottom: '0.35rem' }}>Silk Matte Touch</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-inverse-muted)', lineHeight: 1.5 }}>
                  Non-glare, stone-like texture that feels warm, refined, and serene to hold.
                </p>
              </div>

              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: 'var(--bg-dark-surface)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🎁</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', marginBottom: '0.35rem' }}>Gift Ready</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-inverse-muted)', lineHeight: 1.5 }}>
                  Packed in standard 5×5×5 inch gift-grade cartons ready for housewarmings and festivals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Direct Amazon Store CTA */}
      <section style={{ 
        padding: 'clamp(3.5rem, 5vw, 5.5rem) 0', 
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-subtle) 100%)',
        textAlign: 'center',
        width: '100%'
      }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            Official Amazon India Listings
          </span>
          <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)', fontWeight: '600', marginBottom: '0.85rem' }}>
            Elevate Your Space with Viyona Today
          </h2>
          <p style={{ fontSize: 'clamp(0.98rem, 1.2vw, 1.15rem)', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Browse our catalog, order with Amazon India fulfillment, and experience plant-based precision craftsmanship in your own home.
          </p>
          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://www.amazon.in/dp/B0HF5124YZ" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-amazon"
              style={{ flex: '1 1 220px', minWidth: '200px' }}
            >
              Order on Amazon India ↗
            </a>
            <a 
              href="#collection" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-secondary"
              style={{ flex: '1 1 180px', minWidth: '160px' }}
            >
              Browse All Creations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
