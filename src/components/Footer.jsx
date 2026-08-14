import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'var(--bg-dark)', 
      color: 'var(--text-inverse)',
      padding: '5rem 0 3rem', 
      marginTop: 'auto',
      borderTop: '1px solid #222220'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '3.5rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Brand Manifesto Column */}
          <div style={{ maxWidth: '380px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)',
                  color: '#121211',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '900',
                  fontSize: '1.25rem',
                  letterSpacing: '-0.5px',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}>
                  VD
                </div>
                <div>
                  <div style={{ 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: '1.75rem', 
                    fontWeight: '700', 
                    letterSpacing: '0.04em', 
                    color: '#FFFFFF',
                    lineHeight: 1
                  }}>
                    VIYONA DESIGNS
                  </div>
                  <div style={{ 
                    fontSize: '0.72rem', 
                    letterSpacing: '0.16em', 
                    textTransform: 'uppercase', 
                    color: '#D4AF37',
                    marginTop: '0.25rem',
                    fontWeight: '600'
                  }}>
                    Thoughtfully Designed • Made in India
                  </div>
                </div>
              </div>
            </Link>

            <p style={{ 
              color: 'var(--text-inverse-muted)', 
              fontSize: '0.92rem', 
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              Curators of distinct, precision-crafted design goods. Sculpted for modern Indian homes, serene mandirs, mindful workspaces, and intentional living.
            </p>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              color: '#D4AF37'
            }}>
              <span>🌿</span> 100% Plant-Based Bio-Materials
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div>
            <h4 style={{ 
              fontSize: '0.82rem', 
              fontWeight: '700', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-sans)'
            }}>
              Curated Studio
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <Link to="/product/ganesha-statue" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Lord Ganesha Idol
                </Link>
              </li>
              <li>
                <Link to="/product/sleeping-puppy-organizer" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Sleeping Puppy Catchall
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Our Vision & Story
                </Link>
              </li>
              <li>
                <a href="https://www.amazon.in/dp/B0HF5124YZ" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Amazon India Storefront ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Connect Column */}
          <div>
            <h4 style={{ 
              fontSize: '0.82rem', 
              fontWeight: '700', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-sans)'
            }}>
              Connect & Follow
            </h4>
            <p style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Follow our latest product launches, manufacturing behind-the-scenes, and design stories.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href="https://www.instagram.com/viyonadesigns" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.6rem',
                  color: 'var(--text-inverse)',
                  fontSize: '0.9rem'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>📸</span> Instagram (@viyonadesigns)
              </a>
              <a 
                href="https://www.facebook.com/viyonadesigns" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.6rem',
                  color: 'var(--text-inverse)',
                  fontSize: '0.9rem'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>📘</span> Facebook Community
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          paddingTop: '2rem',
          fontSize: '0.82rem',
          color: 'var(--text-inverse-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Viyona Designs (viyonadesigns.com). Designed & Engineered in India.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>• 100% Sustainable Bio-Polymers</span>
            <span>• Direct Amazon India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
