import { Link } from 'react-router-dom';
import footerLogoImg from '../assets/logo-footer.png';
import { trackLead } from '../utils/analytics';

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', 
          gap: 'clamp(2rem, 3.5vw, 3rem)',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* 1. Brand Manifesto Column */}
          <div style={{ maxWidth: '340px' }}>
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
              fontSize: '0.88rem', 
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

          {/* 2. Collection Column */}
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

          {/* 3. Customer Care & Policies Column */}
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
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Contact Us & Support
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse-muted)'}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Social & Connect Column */}
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
              Connect With Us
            </h4>
            <p style={{ color: 'var(--text-inverse-muted)', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              Follow our latest product launches, precision craft behind-the-scenes, and design stories.
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
                  fontSize: '0.88rem',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse)'}
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
                  fontSize: '0.88rem',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-inverse)'}
              >
                <span>📘</span> Facebook (/viyonadesigns)
              </a>
              <a 
                href="mailto:support@viyonadesigns.com"
                onClick={() => trackLead('email')}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.6rem',
                  color: 'var(--accent-gold)',
                  fontSize: '0.88rem',
                  fontWeight: '500'
                }}
              >
                <span>✉️</span> support@viyonadesigns.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Compliance Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.25rem',
          paddingTop: '2rem',
          fontSize: '0.82rem',
          color: 'var(--text-inverse-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Viyona Designs. All rights reserved. Designed & Precision-Manufactured in India.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/shipping-policy" style={{ color: 'var(--text-inverse-muted)', textDecoration: 'none' }}>
              Shipping Policy
            </Link>
            <span>•</span>
            <Link to="/refund-policy" style={{ color: 'var(--text-inverse-muted)', textDecoration: 'none' }}>
              Return & Refund Policy
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" style={{ color: 'var(--text-inverse-muted)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" style={{ color: 'var(--text-inverse-muted)', textDecoration: 'none' }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
