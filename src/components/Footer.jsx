import { Link } from 'react-router-dom';
import footerLogoImg from '../assets/logo-footer.png';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'var(--bg-dark)', 
      color: 'var(--text-inverse)',
      padding: 'clamp(3.5rem, 6vw, 5rem) 0 calc(4rem + env(safe-area-inset-bottom))', 
      marginTop: 'auto',
      borderTop: '1px solid #222220'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', 
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Brand Manifesto Column */}
          <div style={{ maxWidth: '380px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem', textDecoration: 'none' }}>
              <img 
                src={footerLogoImg} 
                alt="Viyona Designs — Thoughtfully Designed. Perfectly Made." 
                style={{ 
                  height: 'clamp(50px, 6vw, 68px)', 
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform var(--transition-base)'
                }} 
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Link>

            <p style={{ 
              color: 'var(--text-inverse-muted)', 
              fontSize: '0.9rem', 
              lineHeight: 1.65,
              marginBottom: '1.25rem'
            }}>
              Makers of distinct, precision-crafted eco-friendly products & decor. Sculpted for modern Indian homes, serene mandirs, mindful workspaces, and intentional living.
            </p>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
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
              marginBottom: '1rem',
              fontFamily: 'var(--font-sans)'
            }}>
              Our Collection
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/product/ganesha-statue" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Lord Ganesha Idol
                </Link>
              </li>
              <li>
                <Link to="/product/sleeping-puppy-organizer" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Sleeping Puppy Catchall
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Our Vision & Story
                </Link>
              </li>
              <li>
                <a href="https://www.amazon.in/dp/B0HF5124YZ" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
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
              marginBottom: '1rem',
              fontFamily: 'var(--font-sans)'
            }}>
              Connect & Follow
            </h4>
            <p style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Follow our latest product launches, manufacturing behind-the-scenes, and design stories.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a 
                href="https://www.instagram.com/viyonadesigns" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.6rem',
                  color: 'var(--text-inverse)',
                  fontSize: '0.88rem'
                }}
              >
                <span>📸</span> Instagram (@viyonadesigns)
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
                  fontSize: '0.88rem'
                }}
              >
                <span>📘</span> Facebook Community
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
          gap: '0.75rem',
          paddingTop: '1.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-inverse-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Viyona Designs (viyonadesigns.com). Made in India.
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span>• 100% Sustainable Bio-Polymers</span>
            <span>• Direct Amazon India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
